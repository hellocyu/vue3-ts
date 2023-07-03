export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

export interface AttrValue {
  attrId?: number
  id?: number
  valueName: string
  flag?: boolean
}

export type AttrValueList = AttrValue[]

export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
export type AttrList = Attr[]

export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
