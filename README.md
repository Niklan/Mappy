Mappy
====

## Описание
Этот модуль был сделан для того чтобы убить время, как говориться For Fun. Поэтому не рекомендуется его использовать на продакшен сайтах.

Если в модуле будет потребность, то я могу его развивать и дальше.

## Что это и зачем?
Модуль нацелен на простое добавление карт на сайт, при этом оставляя хоть небольшую, но гибкость. Он будет полезен тем кому лень возиться с API различных карт, или банально нет времени или острой необходимости в этом. В данный момент поддерживаются только Яндекс.Карты.

## Как использовать
Достаточно установить и включить данный модуль, как это обычно делается в Drupal. А дальше все просто, достаточно вставить код на страницу сайта в формате (Full HTML, или добавить его в список доверенных) ввода, либо в код страницы и смотреть на результат.

Итак, базово карта вызывается так: `<mappy:yandex address="г. Пермь, ул. Пермская 200" zoom="14" width="800" height="400"></mappy:yandex>`

Данный тег имеет и другие параметры, но для добавления обычной карты достаточно ввести адрес, зум и высоту\длину.

Тег имеет следующие параметры:

<dl>
  <dt>address *</dt>
  <dd>Указывается адрес центра карты.</dd>
  <dd><em>Пример: address="г. Пермь, ул. Пермская 200"</em></dd>

  <dt>width *</dt>
  <dd>Ширина карты.</dd>
  <dd><em>Пример: width="640"</em></dd>
  
  <dt>height *</dt>
  <dd>Высота карты.</dd>
  <dd><em>Пример: height="480"</em></dd>
  
  <dt>address_placemark</dt>
  <dd>true - добавляет метку на центр карты.</dd>
  <dd><em>Пример: address_placemark="true"</em></dd>
  
  <dt>zoom</dt>
  <dd>0 .. 99 - увеличение карты. Чем меньше, тем выше.</dd>
  <dd><em>Пример: zoom="14"</em></dd>
  
  <dt>zoom_control</dt>
  <dd>Добавляет полоску для увеличения\уменьшения карты.</dd>
  <dd>param1 - смещение по x</dd>
  <dd>param2 - смещение по y</dd>
  <dd><em>Пример: zoom_control="20,50"</em></dd>
  
  <dt>small_zoom_control</dt>
  <dd>Добавляет маленькую полоску для увеличения\уменьшения карты.</dd>
  <dd>param1 - смещение по x</dd>
  <dd>param2 - смещение по y</dd>
  <dd><em>Пример: small_zoom_control="20,50"</em></dd>
  
  <dt>zoom_control</dt>
  <dd>Добавляет полоску для увеличения\уменьшения карты.</dd>
  <dd>param1 - смещение по x</dd>
  <dd>param2 - смещение по y</dd>
  <dd><em>Пример: zoom_control="20,50"</em></dd>
  
  <dt>type_selector</dt>
  <dd>true - добавляет выбор типа карты (народная, спутник и т.д.).</dd>
  <dd><em>Пример: type_selector="true"</em></dd>
  
  <dt>traffic_control</dt>
  <dd>true - добавляет кнопку показа пробок на дорогах.</dd>
  <dd><em>Пример: traffic_control="true"</em></dd>
  
  <dt>route</dt>
  <dd>true - добавляет кнопку показа пробок на дорогах.</dd>
  <dd>param1 - id кнопки для прокладки маршрута</dd>
  <dd>param2 - id текстового поля для адреса</dd>
  <dd><em>Пример: route="route-button,route-address"</em></dd>
</dl>

## Примеры

### Пример 1

`<mappy:yandex address="г. Пермь, ул. Пермская 200" zoom="14" width="640" height="480"></mappy:yandex>`

![example1](http://i.imm.io/172qd.jpeg "Exmaple 1")

### Пример 2

`<mappy:yandex address="г. Пермь, ул. Пермская 200" zoom="10" width="640" height="480" address_placemark="true" zoom_control="20,50"></mappy:yandex>`

![example2](http://i.imm.io/172rY.jpeg "Exmaple 2")

### Пример 3

`<mappy:yandex address="г. Пермь, ул. Пермская 200" zoom="10" width="640" height="480" address_placemark="true" small_zoom_control="20,50" type_selector="true" map_tools="50,50" traffic_control="true"></mappy:yandex>`

![example3](http://i.imm.io/172sV.jpeg "Exmaple 3")

### Пример 4

`<mappy:yandex address="г. Пермь, ул. Пермская 200" zoom="15" width="640" height="480" route="create-route,route-start"></mappy:yandex>`
`<input type="text" id="route-start" value="Пермь, "><input type="button" id="create-route" value="Показать путь">`


![example4](http://i.imm.io/172tP.jpeg "Exmaple 4")
