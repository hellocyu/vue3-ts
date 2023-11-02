export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface Attr {
  id?: number
  attrId: string | number
  valueId: string | number
}
export interface SaleAttr {
  id?: number
  saleAttrId: string | number
  saleAttrValueId: string | number
}

export interface SkuData {
  category3Id?: string | number
  spuId?: string | number
  tmId?: string | number
  skuName?: string
  price?: string | number
  weight?: string | number
  skuDesc?: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: SaleAttr[]
  skuDefaultImg: string
  isSale?: number
  id?: number
}

export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: null
    maxLimit: null
    searchCount: boolean
    page: number
  }
}
// 获取sku商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
