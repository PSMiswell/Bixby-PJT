 var http = require('http')

var EndPoint = "http://apis.data.go.kr/B552657/HsptlAsembySearchService/"
var Operation = "getHsptlBassInfoInqire"
var PharmacyEndPoint = "http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/"
var PharmacyOperation = "getParmacyBassInfoInqire"
var ServiceKey = secret.get('servicekey')


var tmapkey = secret.get('tmapkey')
var tmapurl = 'https://apis.openapi.sk.com/tmap/routes'

let params = { version: 1 }

var treatmentList = new Array(
  "내과", "소아청소년과", "이비인후과",
  "안과", "치과", "피부과",
  "가정의학과", "산부인과", "비뇨기과",
  "외과", "정형외과", "성형외과",
  "흉부외과", "재활의학과", "응급의학과",
  "정신건강의학과", "신경과", "신경외과",
  "영상의학과", "치료방사선과", "핵의학과",
  "해부병리과", "임상병리과", "요양병원",
  "마취통증의학과", "구강악안면외과", "한의원"
)

module.exports.function = function getHospitalInfo (hospitalSummaryInfo,currentPosition) {
  const console = require("console")
  let info = {}
  if (hospitalSummaryInfo.isPharmacy == true){
    // 약국
    if ( hospitalSummaryInfo.hpId == "null" && hospitalSummaryInfo.startTime == "null" && hospitalSummaryInfo.endTime == "null" ) {
      info['point'] = null
      info['dutyAddr'] = null
      info['dutyName'] = null
      info['dutyTel1'] = null
      info['startTime'] = null
      info['endTime'] = null
      info['currentPosition'] = null
      info['url'] = null
      info['mapUrl'] = null
    } else {
      var url = PharmacyEndPoint + PharmacyOperation 
        + "?ServiceKey=" + ServiceKey 
        + "&HPID=" + hospitalSummaryInfo.hpId

        var details = http.getUrl(url,{format: 'xmljs'})

        var item = details.response.body.items.item
    
        info['point'] = {
        latitude : item.wgs84Lat,
        longitude : item.wgs84Lon,
        $id : null,
        $type : "viv.geo.GeoPoint"
      }
        
        info['dutyAddr'] = item.dutyAddr
        info['dutyName'] = item.dutyName
        info['dutyTel1'] = item.dutyTel1
        info['startTime'] = hospitalSummaryInfo.startTime
        info['endTime'] = hospitalSummaryInfo.endTime
        info['currentPosition'] = currentPosition
        info['url'] = 'https://search.naver.com/search.naver?query=' + info['dutyName']
        info['mapUrl'] = item.dutyName

        let Startlat = currentPosition.latitude
        let Startlon = currentPosition.longitude

        let Endlat = item.wgs84Lat
        let Endlon = item.wgs84Lon

        let options = {
          format: 'json',
          headers: {
              appKey: tmapkey
          },
          query: {
              totalValue: 1,
              endX: Startlon, // 128
              endY: Startlat, // 36
              startX: Endlon,
              startY: Endlat,
          }
        }
        let tmapreq = http.postUrl(tmapurl, params, options).features[0].properties.totalTime
        info['time'] = parseInt(tmapreq/60)
      }



  } else{ // 병원
    if ( hospitalSummaryInfo.hpId == "null" && hospitalSummaryInfo.startTime == "null" && hospitalSummaryInfo.endTime == "null" ) {
      info['point'] = {
        latitude : null,
        longitude : null,
        $id : null,
        $type : "viv.geo.GeoPoint"
      }
      info['dutyAddr'] = null
      info['dutyName'] = null
      info['dgidIdName'] = null
      info['dutyTel1'] = null
      info['startTime'] = null
      info['endTime'] = null
      info['currentPosition'] = null
      info['url'] = null
      return info
    } else {
      var url = EndPoint + Operation 
      + "?ServiceKey=" + ServiceKey 
      + "&HPID=" + hospitalSummaryInfo.hpId
      var details = http.getUrl(url,{format: 'xmljs'})

      var item = details.response.body.items.item

      var dgidldList = new Array();
      console.log(details.response)
      var originDNList = item.dgidIdName.split(",");

      for(var i=0; i<treatmentList.length; i++){

        if(item.dutyName.includes(treatmentList[i])){
          dgidldList[i] = true;
        }else{
          for(var j=0; j<originDNList.length; j++){
            if(treatmentList[i] == originDNList[j]){
              dgidldList[i] = true;
              break
            }else{
              dgidldList[i] = false;
            }
          }
        }
      }
      info['point'] = {
        latitude : item.wgs84Lat,
        longitude : item.wgs84Lon,
        $id : null,
        $type : "viv.geo.GeoPoint"
      }
      info['dutyAddr'] = item.dutyAddr
      info['dutyName'] = item.dutyName
      info['dgidIdName'] = dgidldList
      info['dutyTel1'] = item.dutyTel1
      info['startTime'] = hospitalSummaryInfo.startTime
      info['endTime'] = hospitalSummaryInfo.endTime
      info['currentPosition'] = currentPosition
      info['url'] = 'https://search.naver.com/search.naver?query=' + info['dutyName']
      info['mapUrl'] = item.dutyName

      let Startlat = currentPosition.latitude
      let Startlon = currentPosition.longitude

      let Endlat = item.wgs84Lat
      let Endlon = item.wgs84Lon

      let options = {
        format: 'json',
        headers: {
            appKey: tmapkey
        },
        query: {
            totalValue: 1,
            endX: Startlon, // 128
            endY: Startlat, // 36
            startX: Endlon,
            startY: Endlat,
        }
      }
      let tmapreq = http.postUrl(tmapurl, params, options).features[0].properties.totalTime
      info['time'] = parseInt(tmapreq/60)
    }
  }
  
    return info

    








  



}

