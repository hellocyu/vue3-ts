//SPU管理模块接口
import request from '@/utils/request'
import {
  HasSpuResponseData,
  AllTradeMark,
  SPuHasImg,
  saleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
} from './type'
enum API {
  HASSPU_URL = '/admin/product/ ',
  ALLTRADEMAKR_URL = '/admin/product/baseTrademark/getTrademarkList',
  IMAGE_URL = '/admin/product/spuImageList/',
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  ADDSKU_URL = '/admin/product/saveSkuInfo',
}

export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMAKR_URL)

export const reqSpIamgeList = (spuId: number) =>
  request.get<any, SPuHasImg>(API.IMAGE_URL + spuId)

export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, saleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)
