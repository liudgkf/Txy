// 部分滑动 数组
var _paramObj = {
    // 穿衣风格
    style: [{"name":'黑丝'},{"name":'长筒袜'},{"name":'吊带袜'},{"name":'蕾丝'},{"name":'超短裙'},{"name":'雪纺裙'},{"name":'连衣裙'},{"name":'牛仔裤'},{"name":'萝莉'},{"name":'清纯'},{"name":'可爱'},{"name":'御姐'},{"name":'甜美'},{"name":'角色扮演'}],
    // 情感
    emotion:[{"name":"单身"},{"name":"热恋"},{"name":"已婚"}],
    // 语言
    language: [{"name":'本地话'},{"name":'普通话'},{"name":'广东话'},{"name":'客家话'},{"name":'英语'},{"name":'日语'}],
    // 约会节目
    dy_program: [{"name":'浪漫电影'},{"name":'以歌会友'},{"name":'夜光晚餐'},{"name":'结伴同游'},{"name":'邀约机会'},{"name":'游戏陪玩'},{"name":'心跳运动'},{"name":'恋爱交友'}],
    // 约会条件
    dy_conditions: [{"name":'看脸'},{"name":'有趣'},{"name":'大方'},{"name":'关爱我'},{"name":'看感觉'},{"name":'无所谓'},{"name":'看情况'}],
    // 约会时间
    dy_time: [{"name":'凌晨'},{"name":'上午'},{"name":'中午'},{"name":'下午'},{"name":'晚上'},{"name":'通宵'},{"name":'一整天'}],
    // 职业
    occupation:[{"name":"在校学生"},{"name":"计算机/互联网/IT"},{"name":"电子/半导体/仪器仪表"},{"name":"通信技术"},{"name":"销售"},{"name":"市场拓展"},{"name":"公关/商务"},{"name":"人力资源/行政/后勤"},{"name":"高级管理"},{"name":"生产/加工/制造"},{"name":"质控/安检"},{"name":"工程机械"},{"name":"技工"},{"name":"财会/审计/统计"},{"name":"金融/证券/投资/保险"},{"name":"房地产/装修/物业"},{"name":"仓储/物流"},{"name":"普通劳动力/家政服务"},{"name":"普通服务行业"},{"name":"航空服务业"},{"name":"教育/培训"},{"name":"咨询/顾问"},{"name":"学术/研究"},{"name":"法律"},{"name":"设计/创意"},{"name":"文学/传媒/影视"},{"name":"餐饮/旅游"},{"name":"化工"},{"name":"能源/地质勘查"},{"name":"医疗/护理"},{"name":"保健/美容"},{"name":"生物/制药/医疗器械"},{"name":"体育工作者"},{"name":"翻译"},{"name":"公务员/国家干部"},{"name":"农/林/牧/渔业"},{"name":"警察"},{"name":"自由职业者"},{"name":"其他"}],
    // 职业
    constellation:[{"name":"水瓶座"},{"name":"双鱼座"},{"name":"白羊座"},{"name":"金牛座"},{"name":"双子座"},{"name":"巨蟹座"},{"name":"狮子座"},{"name":"处女座"},{"name":"天秤座"},{"name":"天蝎座"},{"name":"射手座"},{"name":"摩羯座"}],
}


// 打开滑动模块
function openUIActionSelector(data, param, callback){
    var UIActionSelector = api.require('UIActionSelector');
    var h = api.systemType == 'ios' ? 50 : 40;
    var row = api.systemType == 'ios' ? 3 : 5;
    var fontsize = api.systemType == 'ios' ? 14 : 12;
    var sizeActive = api.systemType == 'ios' ? 14 : 16;
    if(param.col == 1){
        var actives = [2];
    }else if(param.col == 2){
        var actives = [2, 0];
    }else if(param.col == 3){
        var actives = [2, 0, 0];
    }
    UIActionSelector.open({
        datas: data,
        layout: {
            row: row,  // 每屏显示的数据行数
            col: param.col,  // 数据源的数据级数
            height: h,
            size: fontsize,
            sizeActive: sizeActive,
            colorSelected: '#000000'
        },
        cancel: {
            text: '取消',
            size: fontsize,
            color: '#555555',
            colorActive: '#555555'
        },
        ok: {
            text: '确定',
            size: fontsize,
            color: '#000000',
            colorActive: '#000000'
        },
        title: {
            text: '请选择' + param.title,
            size: fontsize,
        },
        actives: actives,
        fixedOn: api.frameName
    },callback);
}