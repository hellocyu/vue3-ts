//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//SPU数据类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: string | number
  spuSaleAttrList: null | saleAttr[]
  spuImageList: null | SpuImage[]
  spuPosterList?: null
}

//数据：元素都是已有SPU数据类型
export type Records = SpuData[]

//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records[]
    total: number
    size: number
    current: number
    pages: number
    searchCount: boolean
  }
}

//所有品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

//品牌接口返回的数据
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

//照片墙
export interface SpuImage {
  id?: number
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
  createTime?: string
  updateTime?: string
}

//已有SPU照片墙
export interface SPuHasImg extends ResponseData {
  data: SpuImage[]
}

//已有的销售属性值对象
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

//存储已有的销售属性值
export type spuSaleAttrValueList = SaleAttrValue[]

//销售属性对象
export interface saleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

//spu已有的销售属性接口返回的数据
export interface saleAttrResponseData extends ResponseData {
  data: saleAttr[]
}

//已有全部spu返回数据
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: string | number
  valueId: string | number
}
export interface SaleAttr {
  saleAttrId: string | number
  saleAttrValueId: string | number
}

export interface SkuData {
  category3Id: string | number
  spuId: string | number
  tmId: string | number
  skuName: string
  price: string | number
  weight: string | number
  skuDesc: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: SaleAttr[]
  skuDefaultImg: string
}

export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
