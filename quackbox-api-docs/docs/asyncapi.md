# Streetlights App 1.0.0 documentation

* License: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

The Smartylighting Streetlights application allows you
to remotely manage the city lights.


## Table of Contents

* [Servers](#servers)
  * [mosquitto](#mosquitto-server)
* [Operations](#operations)
  * [RECEIVE light/measured](#receive-lightmeasured-operation)

## Servers

### `mosquitto` Server

* URL: `mqtt://test.mosquitto.org/`
* Protocol: `mqtt`



## Operations

### RECEIVE `light/measured` Operation

*Information about environmental lighting conditions for a particular streetlight.*

* Operation ID: `onLightMeasured`

#### Message `LightMeasured`

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| id | integer | ID of the streetlight. | - | >= 0 | - |
| lumens | integer | Light intensity measured in lumens. | - | >= 0 | - |
| sentAt | string | Date and time when the message was sent. | - | format (`date-time`) | - |

> Examples of payload _(generated)_

```json
{
  "id": 0,
  "lumens": 0,
  "sentAt": "2019-08-24T14:15:22Z"
}
```



