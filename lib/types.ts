export type ServiceItem = {
  id: string
  description: string
  category: "urudhi" | "ennai_seer_reception_wedding" | "post_wedding"
  unit: string
  rate: number
  defaultQty?: number
}

export type SelectedService = ServiceItem & {
  quantity: number
  amount: number
}

export type ClientInfo = {
  groomName: string
  brideName: string
  urudhiDate: string
  ennaiSeerDate: string
  receptionDate: string
  weddingDate: string
  phone: string
  email: string
  address: string
  paymentType: "advance" | "full"
  paymentMethod: "cash" | "upi"
  advanceAmount?: number
}
