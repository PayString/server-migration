/* eslint-disable @typescript-eslint/naming-convention -- Applying to headers. */
import axios from 'axios'
import { Utils } from 'xpring-js'

import logger from './logger'

// TODO(dino): Once we abstract types from the PayID server, import them instead of redefining
interface Account {
  payId: string
  addresses: PaymentInformation[]
}

interface PaymentInformation {
  paymentNetwork: string
  environment: string
  details: { address: string; tag?: string }
}

/**
 * Get a user from a PayID server.
 *
 * @param baseUrl - Base URL of the PayID server.
 * @param payId - The PayID of the user.
 * @param apiVersion - The Admin API version.
 *
 * @returns A promise of an Account.
 */
async function getAccount(
  baseUrl: string,
  payId: string,
  apiVersion: string,
): Promise<Account> {
  let response
  try {
    response = await axios.request({
      url: `/users/${payId}`,
      method: 'get',
      baseURL: baseUrl,
      headers: { 'PayID-API-Version': apiVersion },
      responseType: 'json',
    })
  } catch (error) {
    logger.error(error.response.data)
  }
  return response?.data
}

/**
 * Put a user from a PayID server.
 *
 * @param baseUrl - Base URL of the PayID server.
 * @param payId - The PayID of the user.
 * @param apiVersion - The Admin API version.
 * @param account - A JSON object with account information.
 */
async function putAccount(
  baseUrl: string,
  payId: string,
  apiVersion: string,
  account: Account,
): Promise<void> {
  try {
    await axios.request({
      url: `/users/${payId}`,
      method: 'put',
      baseURL: baseUrl,
      headers: {
        'PayID-API-Version': apiVersion,
        'Content-Type': 'application/json',
      },
      data: account,
      responseType: 'json',
    })
  } catch (error) {
    logger.error(error.response.data)
  }
}

/**
 * Transform PaymentInformation using xAddress into classic address.
 *
 * @param paymentInfo - A PaymentInformation object from the addresses array of an Account.
 *
 * @returns A PaymentInformation object ( potentially transformed to use classic addresses ).
 */
function transformPaymentInfo(
  paymentInfo: PaymentInformation,
): PaymentInformation {
  const address = paymentInfo.details.address
  if (paymentInfo.paymentNetwork === 'XRPL' && Utils.isValidXAddress(address)) {
    const decodedClassicAddress = Utils.decodeXAddress(address)
    if (decodedClassicAddress) {
      const classicPaymentInfo = paymentInfo
      classicPaymentInfo.details.address = decodedClassicAddress.address
      // eslint-disable-next-line max-depth -- This limit is not useful here.
      if (decodedClassicAddress.tag) {
        classicPaymentInfo.details.tag = String(decodedClassicAddress.tag)
      }
      return classicPaymentInfo
    }
  }
  return paymentInfo
}

/**
 * Get an Account, transform it's addresses to classic address format if applicable,
 * and replace the original account on the server.
 *
 * @param baseUrl - Base URL of the PayID server.
 * @param payId - The PayID of the user.
 * @param apiVersion - The Admin API version.
 */
async function transformAndReplaceAccount(
  baseUrl: string,
  payId: string,
  apiVersion: string,
): Promise<void> {
  const oldAccount = await getAccount(baseUrl, payId, apiVersion)

  const newAccount = {
    payId,
    addresses: oldAccount.addresses.map(transformPaymentInfo),
  }

  void (await putAccount(baseUrl, payId, apiVersion, newAccount))
}

void transformAndReplaceAccount(
  'http://127.0.0.1:8081',
  'dino$127.0.0.1',
  '2020-08-01',
)
