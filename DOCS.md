
# Содержание
- [Общие сведения](#user-content-Общие-сведения)
- [Авторизация](#user-content-Авторизация)
- [Формат запроса](#user-content-Формат-запроса)
- [Формат ответа](#user-content-Формат-ответа)
    - [Коды сообщения об ошибке](#user-content-Коды-сообщения-об-ошибке)
- [Методы](#user-content-Методы)
  - [Accounts](#accounts)
    - [Создание зашифрованного файла авторизации](#user-content-Создание-зашифрованного-файла-авторизации)
      - [HTTP запрос](#http-запрос)
      - [Параметры запроса](#user-content-Параметры-запроса)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры)
      - [Пример](#user-content-Пример)
    - [Смена пароля шифрования файла авторизации](#user-content-Смена-пароля-шифрования-файла-авторизации)
      - [HTTP запрос](#http-запрос-1)
      - [Параметры запроса](user-content-Параметры-запроса-1)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры-1)
      - [Пример](#user-content-Пример-1)
    - [Расшифровка приватного ключа](#user-content-Расшифровка-приватного-ключа)
      - [HTTP запрос](#http-запрос-2)
      - [Параметры запроса](#user-content-Параметры-запроса-2)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры-2)
      - [Пример](#user-content-Пример-2)
    - [Получение баланса токенов](#user-content-Получение-баланса-токенов)
      - [HTTP запрос](#http-запрос-3)
      - [Параметры запроса](#user-content-Параметры-запроса-3)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры-3)
      - [Пример](#user-content-Пример-3)
  - [Операции](#user-content-Операции)
    - [Перевод токенов](#user-content-Перевод-токенов)
      - [HTTP запрос](#http-запрос-4)
      - [Параметры запроса](#user-content-Параметры-запроса-4)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры-4)
      - [Пример](#user-content-Пример-4)
    - [Список транзакций](#user-content-Список-транзакций)
      - [HTTP запрос](#http-запрос-5)
      - [Параметры запроса](#user-content-Параметры-запроса-5)
      - [Параметры фильтрации](#user-content-Параметры-фильтрации)
      - [Параметры сортировки](#user-content-Параметры-сортировки)
      - [Пагинация](#user-content-Пагинация)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры-5)
      - [Пример](#user-content-Пример-5)
    - [Информация об одной транзакции](#user-content-Информация-об-одной-транзакции)
      - [HTTP запрос](#http-запрос-6)
      - [Параметры запроса](#user-content-Параметры-запроса-6)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры-6)
      - [Пример](#user-content-Пример-6)
  - [Дополнительно](#user-content-Дополнительно)
    - [Получение размера комиссии](#user-content-Получение-размера-комиссии)
      - [HTTP запрос](#http-запрос-7)
      - [Возвращаемые параметры](#user-content-Возвращаемые-параметры-7)
      - [Пример](#user-content-Пример-7)
 
# Общие сведения
Все запросы необходимо отправлять на адрес `http://localhost:8008/api/v1/`.

Для успешного вызова API необходимо корректно указывать заголовки `Accept` и `Content-Type` со значением `application/json`.


# Авторизация
Bitlle Network Api имеет 2 типа методов: публичные и приватные. Приватные методы выполняются только авторизованными пользователями.

Токен авторизации необходимо передавать в заголовке `Authorization` каждого запроса. 

Пример: `Authorization: Bearer access_api_token`

# Формат запроса
Любой запрос должен быть представлен в JSON-формате. 

Пример тела запроса
```
{"login": "ivanov","password": "123456"}
```


# Формат ответа

Любой ответ от сервера представлен в JSON-формате. В случае успешного выполнения запроса возвращается необходимый набор ключей и значений, предназначенный для конкретного ответа на запрос.

В случае выполнения операции с ошибкой возвращается JSON, содержащий:

`status` - HTTP код ошибки

`code` – [код сообщения об ошибке](#Коды-сообщения-об-ошибке)

`name` – название ошибки

`message` – сообщение об ошибке


### Коды сообщения об ошибке


Код | Описание
--------- | ------- 
0 | Метод не найден
1 | Ошибка авторизации
3 | Ошибка обработки полученных данных
4 | Внутренняя ошибка
5 | Внутренняя ошибка сервера
6 | Сервер REST не отвечает

Пример ответа при ошибке
```
{
    "status": 422,
    "error": {
        "code": 3,
        "name": "Unprocessable Entity",
        "message": "The specified parameters are incorrect",
        "fields": [
            {
                "location": "body",
                "param": "tokenSellAddr",
                "msg": "tokenSellAddr is empty or invalid",
                "value": "00xe133a7e3373094ce48c2db91dfc9b6d817832264"
            },
            {
                "location": "body",
                "param": "amount",
                "msg": "Invalid amount or insufficience balance",
                "value": 1
            }
        ]
    }
}
```

# Методы

## Accounts
 
### Создание зашифрованного файла авторизации
Получение json файла с зашифрованным приватным ключом

Публичный метод.

#### HTTP запрос
`POST http://localhost:8008/api/v1/accounts`

#### Параметры запроса

*авторизация не требуется*

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
login | String, Integer | да | Используется для создания приватного ключа 
password | String | да | Пароль шифрования приватного ключа


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
jsonFile | String | json с зашифрованным приватным ключом


#### Пример

запрос
```
curl http://localhost:8008/api/v1/accounts
    -H 'Content-Type: application/json' 
    -X POST 
    -d '{"login": "ivanov","password": "123456"}'
```

ответ
```
{
    "jsonFile": "{\"address\":\"4bdc3db8880ed14dd49488cb3502c8cc105d7e91\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"f436dde089773ccf2211307d931c5ceb1bf6d6737e08d55123e43ac7a361b9fd\",\"cipherparams\":{\"iv\":\"cefdede80051d7df7350919813f62310\"},\"mac\":\"ab588d773ca7cbc28f48f0ccab0dce49ebdc0f9c03c4d918361291ea9b24fd88\",\"kdf\":\"pbkdf2\",\"kdfparams\":{\"c\":2621,\"dklen\":32,\"prf\":\"hmac-sha256\",\"salt\":\"0181f28d1f5bf05427c643775a5066295891e35f312444904b19400ce025fb9a\"}},\"id\":\"953c718c-76eb-4d6b-8fc3-45bd524f5b8b\",\"version\":3}"
}
```



### Смена пароля шифрования файла авторизации
Смена пароля шифрования json файла с приватным ключом

Публичный метод.

#### HTTP запрос
`PUT http://localhost:8008/api/v1/accounts`

#### Параметры запроса

*авторизация не требуется*

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
jsonFile | String | да | json с зашифрованным приватным ключом 
oldpassword | String | да | Пароль шифрования приватного ключа
password | String | да | Новый пароль шифрования приватного ключа


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
jsonFile | String | json с зашифрованным приватным ключом


#### Пример

запрос
```
curl http://localhost:8008/api/v1/accounts
    -H 'Content-Type: application/json' 
    -X PUT 
    -d '{"oldpassword" :"123456","password":"newpassword", "jsonFile": "{\"address\":\"96e5b17c494df20d5d9bd2de8edcae0041df272f\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"b5b3dac8b0a9fa64bba306de4ac022bed66064c4b987ef9dc73ca7cbace848ca\",\"cipherparams\":{\"iv\":\"575700d976bb9223f45dff16214995d5\"},\"mac\":\"3ccdcccc654279ea3ac347fbc7b494a6cf4cbd3ce7e3a2743bb1dc250d9569e0\",\"kdf\":\"pbkdf2\",\"kdfparams\":{\"c\":2621,\"dklen\":32,\"prf\":\"hmac-sha256\",\"salt\":\"b4ae860101de91c758350716382c36fcd886553c32f5b28dbb4d472da3e88f6a\"}},\"id\":\"f3cbfc2d-a31e-4699-929a-79be90912155\",\"version\":3}"}'
```

ответ
```
{
    "jsonFile": "{\"json\":{\"address\":\"6d57e0187b87175b031bc05aa8a36163f9300396\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"941c042d862bb2ced82d2e511766dcc1efc9b530fe0e5052e7d252fa0cf4e32c\",\"cipherparams\":{\"iv\":\"e885678bd80598ee9cb8b40dec46a63c\"},\"mac\":\"3593c59e5327830d89a236796c9bb828150a1ebe2b71800134262fd30599c939\",\"kdf\":\"pbkdf2\",\"kdfparams\":{\"c\":2621,\"dklen\":32,\"prf\":\"hmac-sha256\",\"salt\":\"5659fe444056853ef8c142e7ff4011f28c70e58a2aa198395278f700e6d44724\"}},\"id\":\"8283fa42-1657-4245-ab40-b8d2edfc4156\",\"version\":3},\"privateKey\":\"0xaabdf7ecf828c441aec7f8d273a4a2c17f34ae16ef1fd1e0e3026fbfece3bbe0\"}"
}
```



### Расшифровка приватного ключа
Получение приватного ключа из json файла

Публичный метод.

#### HTTP запрос
`POST http://localhost:8008/api/v1/accounts/privatekey`

#### Параметры запроса

*авторизация не требуется*

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
jsonFile | String | да | json с зашифрованным приватным ключом 
password | String | да | Пароль шифрования приватного ключа


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
privateKey | String | Приватный ключ

#### Пример

запрос
```
curl http://localhost:8008/api/v1/accounts/privatekey
    -H 'Content-Type: application/json'
    -X PUT 
    -d '{"password" :"123456","jsonFile": "{\"address\":\"96e5b17c494df20d5d9bd2de8edcae0041df272f\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"b5b3dac8b0a9fa64bba306de4ac022bed66064c4b987ef9dc73ca7cbace848ca\",\"cipherparams\":{\"iv\":\"575700d976bb9223f45dff16214995d5\"},\"mac\":\"3ccdcccc654279ea3ac347fbc7b494a6cf4cbd3ce7e3a2743bb1dc250d9569e0\",\"kdf\":\"pbkdf2\",\"kdfparams\":{\"c\":2621,\"dklen\":32,\"prf\":\"hmac-sha256\",\"salt\":\"b4ae860101de91c758350716382c36fcd886553c32f5b28dbb4d472da3e88f6a\"}},\"id\":\"f3cbfc2d-a31e-4699-929a-79be90912155\",\"version\":3}"}'
```

ответ
```
{
    "privateKey": "0x237ff21386305844d32dbca9e01ce2bca29c5d9d7ac940d136a71aa31ff6e9e7"
}
```



### Получение баланса токенов
Получение баланса токенов у пользователя по адресу

Публичный метод.

#### HTTP запрос
`GET http://localhost:8008/api/v1/accounts/:address/balance/:tokenAddr`

#### Параметры запроса

*авторизация не требуется*

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
:address | String | да | Адрес клиента
:tokenAddr | String | да | Адрес токена


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
balance | String | Баланс пользователя


#### Пример

запрос
```
curl  http://localhost:8008/api/v1/accounts/0xA2329b4251cc6d06476Aa9AcE7133a7A5eFde2eb/balance/0x292791d3d43120548f4262655225d23fede289c5
    -H 'Content-Type: application/json'
```

ответ
```
{
    "balance": "100145.2585"
}
```




## Операции

### Перевод токенов
Перевод токенов от пользователя к пользователю. При указании параметра `mint = 1` происходит эмиссия токенов на адрес указанного пользователя.

Следует учитывать комиссию (актуальный размер которой можно получить при помощи метода [/api/v1/info/fee](##user-content-Получение-размера-комиссии)). Комиссия будет прибавляться к сумме перевода.

В случае простого перевода, баланс отправителя должен быть не меньше суммы: сумма перевода + размер комиссии.

В случае эмиссии, производится 2 эмиссии: 1 эмиссия суммы перевода на адрес получателя и 2 эмиссия - в размере комиссии на адрес агрегатора.

**Операцию по эмиссии токенов может производить только владелец токена.**  

Приватный метод.

#### HTTP запрос
`POST http://localhost:8008/api/v1/transfer`

#### Параметры запроса

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
tokenAddr | String | да | Адрес токена
toAddr | String | да | Адрес получателя
amount | String, Number | да | Сумма перевода
privateKey | String | да | Приватный ключ
externalId | String | нет | Идентификатор в системе клиента 
mint | Integer | нет | Произвести эмиссию


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
id | Integer | Внутренний идентификатор
externalId | Null, String | Идентификатор в системе клиента
type | String | Тип транзакции
tx | String | json описание транзакции
status | String | Статус транзакции (значения: prepare, pending, approved, declined, cancel) 
status_sended | null, Integer | Статус отправки в блокчейн (значения: null, 1 ,0)
status_executed | null, Integer | Статус выполнения внутренней транзакции в блокчейне (значения: null, 1 ,0)
hash | null, String | Hash транзакции в блокчейн
nonce | null, Integer | Номер транзакции в блокчейн
errors | String | Лог ошибок
updated_at | String | Время последнего обновления записи
created_at | String | Время создания записи



#### Пример

запрос
```
curl http://localhost:8008/api/v1/accounts/0x9564fE83aCf1C4dDE9F68399b8B6BF6BfBC5418e/balance/0x676C43dFF0B3D440787c2c4eed43E5EAe1aBF243
    -H 'Content-Type: application/json'
    -X POST
    -d '{"tokenAddr":"0x9564fE83aCf1C4dDE9F68399b8B6BF6BfBC5418e","toAddr":"0x676C43dFF0B3D440787c2c4eed43E5EAe1aBF243","amount":1,"privateKey": "0x63c739cb9ac0d5e4532b24fd429c5dd5c30657c3302cf34e0f8956ce531b6c48"}'
```

ответ
```
{
    "id": 92,
    "externalId": "7",
    "type": "transfer",
    "tx": "{\"token\":\"0x9564fE83aCf1C4dDE9F68399b8B6BF6BfBC5418e\",\"to\":\"0x676C43dFF0B3D440787c2c4eed43E5EAe1aBF243\",\"amount\":\"1000000000000000000\",\"fee\":10000000000000000,\"nonce\":1541937481602,\"v\":28,\"r\":\"0x8fb05b9ba8ea1d941aa926f83fa93c81f69b447325b3de9f2ed15477a486e576\",\"s\":\"0x155b30ded6060696c0b7740bb92489b7c85a622c37556213fa1e86f34784fe33\"}",
    "status": "prepare",
    "status_sended": null,
    "status_executed": null,
    "hash": null,
    "nonce": null,
    "errors": "",
    "updated_at": "2018-11-11 12:58:00",
    "created_at": "2018-11-11 12:58:00"
}
```



##Транзакции

### Список транзакций
Возвращение списка транзакций.
Возможна фильтрация по статусам и типам транзакций.
Постраничный вывод данных.
Доступна сортировка.

Приватный метод.

#### HTTP запрос
`GET http://localhost:8008/api/v1/transactions`

#### Параметры запроса

*требуется авторизация*

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
page | Integer | нет | Номер страницы 
status, type | String | нет | [параметры фильтрации](#user-content-Параметры-фильтрации) 
sort | String | нет | [параметры сортировки](#user-content-Параметры-сортировки) 

#### Параметры фильтрации
Возможно использование фильтрации по нескольким значениям (разделитель - запятая)

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
status | String | нет | возможные значения: prepare, pending, approved, declined, cancel.
type | String | нет | возможные значения: mint, transfer

#### Параметры сортировки
По умолчанию действует сортировка типа ASC, для использования DESC - необходимо добавить "-" перед значением параметра sort 

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
sort | String | нет | возможные значения - все получаемые из выборки поля

#### Пагинация
Параметры пагинации указаны в заголовках ответа 

Параметр  | Описание
--------- | -----
x-pagination-total-count | Количество элементов всего
x-pagination-per-page | Количество элементов на страницу
x-pagination-current-page | Номер текущей страницы
x-pagination-page-count | Количество страниц


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
id | Integer | Внутренний идентификатор
externalId | String | Идентификатор в системе клиента
type | String | Тип транзакции
tx | String | json описание транзакции
status | String | Статус транзакции (значения: prepare, pending, approved, declined, cencel) 
status_sended | Integer | Статус отправки в блокчейн (значения: null, 1 ,0)
status_executed | Integer | Статус выполнения внутренней транзакции в блокчейне (значения: null, 1 ,0)
hash | String | Hash транзакции в блокчейн
nonce | Integer | Номер транзакции в блокчейн
cell | Integer | ID ячейки в обменнике
balance | String | Оставшийся баланс в заявке
errors | String | Лог ошибок
updated_at | String | Время последнего обновления записи
created_at | String | Время создания записи



#### Пример

запрос
```
curl http://localhost:8008/api/v1/transactions
    -H 'Content-Type: application/json'
```

ответ
```
[
    {
        "id": 92,
        "externalId": "7",
        "type": "transfer",
        "tx": "{\"token\":\"0x9564fE83aCf1C4dDE9F68399b8B6BF6BfBC5418e\",\"to\":\"0x676C43dFF0B3D440787c2c4eed43E5EAe1aBF243\",\"amount\":\"1000000000000000000\",\"fee\":10000000000000000,\"nonce\":1541937481602,\"v\":28,\"r\":\"0x8fb05b9ba8ea1d941aa926f83fa93c81f69b447325b3de9f2ed15477a486e576\",\"s\":\"0x155b30ded6060696c0b7740bb92489b7c85a622c37556213fa1e86f34784fe33\"}",
        "status": "prepare",
        "status_sended": null,
        "status_executed": null,
        "hash": null,
        "nonce": null,
        "errors": "",
        "updated_at": "2018-11-11 12:58:00",
        "created_at": "2018-11-11 12:58:00"
    },
   {
       "id": 93,
       "externalId": "7",
       "type": "transfer",
       "tx": "{\"token\":\"0x9564fE83aCf1C4dDE9F68399b8B6BF6BfBC5418e\",\"to\":\"0x676C43dFF0B3D440787c2c4eed43E5EAe1aBF243\",\"amount\":\"1000000000000000000\",\"fee\":10000000000000000,\"nonce\":1541937481602,\"v\":28,\"r\":\"0x8fb05b9ba8ea1d941aa926f83fa93c81f69b447325b3de9f2ed15477a486e576\",\"s\":\"0x155b30ded6060696c0b7740bb92489b7c85a622c37556213fa1e86f34784fe33\"}",
       "status": "prepare",
       "status_sended": null,
       "status_executed": null,
       "hash": null,
       "nonce": null,
       "errors": "",
       "updated_at": "2018-11-11 12:58:00",
       "created_at": "2018-11-11 12:58:00"
   }
]
```

Другие примеры запросов
```
#Получить содержимое второй страницы 
curl http://localhost:8008/api/v1/transactions?page=2
    -H 'Content-Type: application/json'
    
#Получить только успешно исполненные транзакции
curl http://localhost:8008/api/v1/transactions?status=approved
    -H 'Content-Type: application/json'
    
#Отсортировать по дата создания транзакции
curl http://localhost:8008/api/v1/transactions?sort=-created_at
    -H 'Content-Type: application/json'
```


### Информация об одной транзакции
Возвращение информации об одной транзакции.

(необязательно) Актуализация баланса (для заявки на обмен)  

Приватный метод.

#### HTTP запрос
`GET http://localhost:8008/api/v1/transactions/:id`

#### Параметры запроса

*требуется авторизация*

Параметр | Тип данных |  Обязательное | Описание
--------- | ------- | ----------- | -----
id | Integer | да | ID транзакции в системе


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
id | Integer | Внутренний идентификатор
externalId | String | Идентификатор в системе клиента
type | String | Тип транзакции
tx | String | json описание транзакции
status | String | Статус транзакции (значения: prepare, pending, approved, declined, cencel) 
status_sended | Integer | Статус отправки в блокчейн (значения: null, 1 ,0)
status_executed | Integer | Статус выполнения внутренней транзакции в блокчейне (значения: null, 1 ,0)
hash | String | Hash транзакции в блокчейн
nonce | Integer | Номер транзакции в блокчейн
cell | Integer | ID ячейки в обменнике
balance | Number | Оставшийся баланс в заявке
errors | String | Лог ошибок
updated_at | String | Время последнего обновления записи
created_at | String | Время создания записи


#### Пример

запрос
```
curl http://localhost:8008/api/v1/transactions/1
    -H 'Content-Type: application/json'
```

ответ
```
{
    "id": 17,
    "externalId": "7",
    "type": "mint",
    "tx": "{\"token\":\"0xc65500edFE9b12590224644A87a12752C9cD06B0\",\"nonce\":1541773754841,\"to\":\"0xf94b400605b9330E1fa2A16090684cC62C2a050d\",\"amount\":\"1000000000000000000\",\"fee\":10000000000000000,\"v\":27,\"r\":\"0x7bc98454a77418886b83f6cf67a30c8ae7ca61e7502fc167bffa468777da2b6a\",\"s\":\"0x15697ad31979cb443fe410367914e84cf5626a00ba52f96e4079ac9440d579f1\"}",
    "status": "approved",
    "status_sended": 1,
    "status_executed": 1,
    "hash": "0x5c14f884074649d7590da94b18da6b1c5f7de9df46dc42a17d6f0a68882ae800",
    "nonce": 4827,
    "errors": "",
    "updated_at": "2018-11-09 15:29:56",
    "created_at": "2018-11-09 15:29:14"
}
```

## Дополнительно

### Получение размера комиссии
Получение размера актуальной комиссии  

Публичный метод.

#### HTTP запрос

*авторизация не требуется*

`GET http://localhost:8008/api/v1/info/fee`


#### Возвращаемые параметры

Параметр | Тип данных |  Описание
--------- | ------- | -----
fee | String | Процент комиссии за перевод
feeMin | String | Размер минимальной комиссии 

#### Пример

запрос
```
curl http://localhost:8008/api/v1/info/fee
    -H 'Content-Type: application/json'
```

ответ
```
{
    "fee": "0.01",
    "feeMin": "0.01"
}
```


