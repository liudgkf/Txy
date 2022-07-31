var Map = function () {
    var bMap = api.require('bMap');

    // 获取当前经纬度
    this.getLocation = function (callback) {
        var sys = api.systemType;
        if (sys == 'ios') {
            api.startLocation({
                accuracy: '10m',
                filter: 1,
                autoStop: true
            }, function(ret, err){
                var result = {status: ret.status, lon: ret.longitude, lat: ret.latitude};
                callback(result, err);
            });
        } else {
            bMap.getLocation({
                accuracy: '10m',
                autoStop: true,
                filter: 1
            }, callback);
        }
    }

    // 通过经纬度获取当前地址
    this.getAddress = function(lon, lat, callback){
        bMap.getNameFromCoords({
            lon: lon,
            lat: lat
        }, callback);
    }
}