// TODO(dino): Once we abstract types from the PayID server, import them instead of redefining
export interface Account {
  payId: string
  addresses: PaymentInformation[]
}

export interface PaymentInformation {
  paymentNetwork: string
  environment: string
  details: { address: string; tag?: string }
}
