/* eslint-disable no-await-in-loop -- We want to wait for each request to process to not
overload the PayID server with requests. */
/* eslint-disable @typescript-eslint/naming-convention -- Improperly linting the 'headers'
 below */
import axios from 'axios'

import logger from './logger'
import { Account, PaymentInformation } from './types'

/**
 * Get a user from a PayID server.
 *
 * @param baseUrl - Base URL of the PayID server.
 * @param payId - The PayID of the user.
 * @param apiVersion - The Admin API version.
 *
 * @returns A promise of an Account.
 */
export async function getAccount(
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
export async function putAccount(
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
 * For an array of accounts - get an account, apply an address transform, and replace
 * the original account on the server.
 *
 * @param baseUrl - Base URL of the PayID server.
 * @param payIds - An array of user PayIDs.
 * @param apiVersion - The Admin API version.
 * @param tranformFn - The function to transform each PaymentInformation object.
 */
export async function getAndPutWithTransform(
  baseUrl: string,
  payIds: string[],
  apiVersion: string,
  tranformFn: (paymentInfo: PaymentInformation) => PaymentInformation,
): Promise<void> {
  for (const payId of payIds) {
    const oldAccount = await getAccount(baseUrl, payId, apiVersion)

    const newAccount = {
      payId,
      addresses: oldAccount.addresses.map(tranformFn),
    }

    await putAccount(baseUrl, payId, apiVersion, newAccount)
  }
}
