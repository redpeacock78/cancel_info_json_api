//休講情報を取得してJSON形式に変換して返す
function doGet(e) {
  //URLとHTMLタグの正規表現を指定
  const url = 'https://www.kyoto-art.ac.jp/student/';
  const html_tag = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
  
  //URLから情報をスクレイピング
  let responce = UrlFetchApp.fetch(url).getContentText().split(/\r\n|\r|\n/);
  let last_num = responce.indexOf('        </section>');
  let data_block = String(responce.slice(1,last_num)).replace(/,/g, '\n');

  //それぞれ情報を抽出
  let date = String(data_block.match(/<p class="date font-roboto">.*/g)).replace(html_tag, '').split(',');
  let day_of_week = String(data_block.match(/<p class="time">.*<span class="u-dib">/g)).replace(html_tag, '').replace(/ /g, '').split(',');
  let time = String(data_block.match(/<span class="u-dib">.*/g)).replace(html_tag, '').split(',');
  let genre = String(data_block.match(/<p class="cat u-bgColor-.*">.*/g)).replace(html_tag, '').split(',');
  let title = String(data_block.match(/<p class="tit">.*/g)).replace(html_tag, '').split(',');
  let staff = String(data_block.match(/<p class="staff">.*/g)).replace(html_tag, '').replace(/担当教員：/g '').split(',');

  //JSONデータを生成
  let canceled_class = new Array();
  let json;
  let info;
  for (let i = 0;i < date.length;i++) {
      info = {
          "date": date[i],
          "day_of_week": String(day_of_week[i]),
          "time": String(time[i]),
          "genre": String(genre[i]),
          "title": String(title[i]),
          "staff": String(staff[i])
      }
      canceled_class.push(info);
  }
  json = {canceled_class};
  
  //生成したJSONデータを返す
  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  out.setContent(JSON.stringify(json));
  return out;
}