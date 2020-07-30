import { Utils } from 'xpring-js'

import { PaymentInformation } from './types'

/**
 * Transform PaymentInformation using xAddress into classic address.
 *
 * @param paymentInfo - A PaymentInformation object from the addresses array of an Account.
 *
 * @returns A PaymentInformation object ( potentially transformed to use classic addresses ).
 */
export default function xAddressToClassic(
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
