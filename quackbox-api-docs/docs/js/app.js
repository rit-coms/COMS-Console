
    const schema = {
  "asyncapi": "3.0.0",
  "info": {
    "title": "Quackbox API",
    "version": "2.0.0",
    "description": "This is the API documentation for the Quackbox local web server based on the AsyncAPI 3.0.0 specification.\n\nSome useful links:\n- [Quackbox GitHub Repository](https://github.com/rit-coms/COMS-Console)\n- [The source API definition for the Quackbox](TODO)",
    "license": {
      "name": "MIT License",
      "url": "https://www.apache.org/licenses/LICENSE-2.0"
    },
    "contact": {
      "email": "coms@rit.edu",
      "name": "Computing Organization for Multicultural Students"
    }
  },
  "defaultContentType": "application/json",
  "servers": {
    "QuackboxAPI": {
      "host": "localhost:6174/api/v2",
      "protocol": "http",
      "description": "Local web server for interacting with the Quackbox.",
      "tags": [
        {
          "name": "Leaderboard",
          "description": "Access to leaderboard data"
        },
        {
          "name": "Save Data",
          "description": "Read and write save data"
        }
      ]
    }
  },
  "channels": {
    "save_data": {
      "address": "/save-data/player_slots/{player_slot}",
      "parameters": {
        "player_slot": {
          "description": "The player slot to retrieve leaderboard entries for. This is the slot number of the player.",
          "enum": [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8"
          ]
        }
      },
      "messages": {
        "save_data_entry": {
          "name": "save_data_entry",
          "title": "Save Data Entry",
          "summary": "Contains information about a save data entry",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "properties": {
              "data": {
                "type": "object",
                "additionalProperties": true,
                "description": "The save data for the current user. This will be a JSON object with the save data as defined by the game developer.",
                "x-parser-schema-id": "<anonymous-schema-2>"
              },
              "time_stamp": {
                "type": "string",
                "format": "date-time",
                "description": "Date and time this entry was saved.",
                "x-parser-schema-id": "time_stamp"
              },
              "file_name": {
                "type": "string",
                "description": "The file name of the save data entry.",
                "x-parser-schema-id": "<anonymous-schema-3>"
              }
            },
            "additionalProperties": false,
            "x-parser-schema-id": "save_data_payload"
          },
          "description": "Containts a timestamp of when the save data entry was created, the file name of the save data entry, and the save data itself.",
          "bindings": {
            "http": {
              "statusCode": 200,
              "headers": {
                "type": "object",
                "Content-Type": {
                  "type": "string",
                  "enum": [
                    "application/json"
                  ]
                }
              }
            }
          },
          "x-parser-unique-object-id": "save_data_entry"
        },
        "new_save_data": {
          "name": "new_save_data",
          "title": "New Save Data",
          "summary": "Represents a new save data entry to be inserted into the Quackbox database",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "additionalProperties": true,
            "description": "The save data for the current user. This will be a JSON object with the save data as defined by the game developer.",
            "x-parser-schema-id": "<anonymous-schema-4>"
          },
          "x-parser-unique-object-id": "new_save_data"
        },
        "get": {
          "name": "get",
          "title": "GET request",
          "summary": "Represents a GET request. Refer to the HTTP query parameters above for more information.",
          "contentType": "application/json",
          "x-parser-unique-object-id": "get"
        }
      },
      "x-parser-unique-object-id": "save_data"
    },
    "save_data_info": {
      "address": "/save-data/player_slots/{player_slot}/info",
      "parameters": {
        "player_slot": "$ref:$.channels.save_data.parameters.player_slot"
      },
      "messages": {
        "save_data_info": {
          "name": "save_data_info",
          "title": "Save Data Info",
          "summary": "Contains information about the save data entries for a specific player slot.",
          "contentType": "application/json",
          "payload": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "file_name": {
                  "type": "string",
                  "description": "The file name of the save data entry.",
                  "x-parser-schema-id": "<anonymous-schema-7>"
                },
                "time_stamp": "$ref:$.channels.save_data.messages.save_data_entry.payload.properties.time_stamp"
              },
              "additionalProperties": false,
              "x-parser-schema-id": "save_data_info"
            },
            "x-parser-schema-id": "<anonymous-schema-6>"
          },
          "description": "Contains a list of save data entries for a specific player slot.  This will be a JSON object with the player slot and an array of save data entries.",
          "bindings": {
            "http": {
              "statusCode": 200,
              "headers": {
                "type": "object",
                "Content-Type": {
                  "type": "string",
                  "enum": [
                    "application/json"
                  ]
                }
              }
            }
          },
          "x-parser-unique-object-id": "save_data_info"
        },
        "get": "$ref:$.channels.save_data.messages.get"
      },
      "x-parser-unique-object-id": "save_data_info"
    },
    "leaderboard_global": {
      "address": "/leaderboard/global/{leaderboard_name}",
      "parameters": {
        "leaderboard_name": {
          "description": "The name of the leaderboard value to retrieve. This is the title that should be displayed on the leaderboard."
        }
      },
      "messages": {
        "leaderboard_entries": {
          "name": "leaderboard_entries",
          "title": "Leaderboard Entries",
          "summary": "Contains a list of leaderboard entries",
          "contentType": "application/json",
          "payload": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "leaderboard_name",
                "value_num",
                "user_id"
              ],
              "properties": {
                "leaderboard_name": {
                  "type": "string",
                  "description": "The name of the leaderboard value. This is the title that should be displayed on the leaderboard.",
                  "x-parser-schema-id": "<anonymous-schema-10>"
                },
                "value_num": {
                  "type": "number",
                  "description": "The value of the leaderboard entry. This is the score or other value that is being tracked on the leaderboard.",
                  "x-parser-schema-id": "<anonymous-schema-11>"
                },
                "user_id": {
                  "type": "string",
                  "description": "The unique identifier for the user.",
                  "x-parser-schema-id": "<anonymous-schema-12>"
                }
              },
              "additionalProperties": false,
              "x-parser-schema-id": "leaderboard_payload"
            },
            "x-parser-schema-id": "<anonymous-schema-9>"
          },
          "description": "Contains a list of leaderboard entries. This will be a JSON array of leaderboard objects.",
          "bindings": {
            "http": {
              "statusCode": 200,
              "headers": {
                "type": "object",
                "Content-Type": {
                  "type": "string",
                  "enum": [
                    "application/json"
                  ]
                }
              }
            }
          },
          "x-parser-unique-object-id": "leaderboard_entries"
        },
        "get": "$ref:$.channels.save_data.messages.get"
      },
      "x-parser-unique-object-id": "leaderboard_global"
    },
    "leaderboard_user": {
      "address": "/leaderboard/global/{user_id}/{leaderboard_name}",
      "parameters": {
        "user_id": {
          "description": "This is the unique identifier for the user."
        },
        "leaderboard_name": "$ref:$.channels.leaderboard_global.parameters.leaderboard_name"
      },
      "messages": {
        "leaderboard_entry": {
          "name": "leaderboard_entry",
          "title": "Leaderboard Entry",
          "summary": "Contains information about a leaderboard entry",
          "contentType": "application/json",
          "payload": "$ref:$.channels.leaderboard_global.messages.leaderboard_entries.payload.items",
          "description": "Contains the name, value, and player slot of the leaderboard entry.",
          "bindings": {
            "http": {
              "statusCode": 200,
              "headers": {
                "type": "object",
                "Content-Type": {
                  "type": "string",
                  "enum": [
                    "application/json"
                  ]
                }
              }
            }
          },
          "x-parser-unique-object-id": "leaderboard_entry"
        },
        "get": "$ref:$.channels.save_data.messages.get"
      },
      "x-parser-unique-object-id": "leaderboard_user"
    },
    "leaderboard_player_slots": {
      "address": "/leaderboard/{player_slot}/{leaderboard_name}",
      "parameters": {
        "player_slot": "$ref:$.channels.save_data.parameters.player_slot",
        "leaderboard_name": "$ref:$.channels.leaderboard_global.parameters.leaderboard_name"
      },
      "messages": {
        "leaderboard_entry": "$ref:$.channels.leaderboard_user.messages.leaderboard_entry",
        "new_leaderboard_entry": {
          "name": "new_leaderboard_entry",
          "title": "New Leaderboard Entry",
          "summary": "Represents a new leaderboard entry to be inserted into the Quackbox database. This will not overwrite existing leaderboard entries.",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "properties": {
              "leaderboard_name": {
                "type": "string",
                "description": "The name of the leaderboard value. This is the title that should be displayed on the leaderboard.",
                "x-parser-schema-id": "<anonymous-schema-18>"
              },
              "value_num": {
                "type": "number",
                "description": "The value of the leaderboard entry. This is the score or other value that is being tracked on the leaderboard.",
                "x-parser-schema-id": "<anonymous-schema-19>"
              }
            },
            "additionalProperties": false,
            "x-parser-schema-id": "<anonymous-schema-17>"
          },
          "x-parser-unique-object-id": "new_leaderboard_entry"
        },
        "get": "$ref:$.channels.save_data.messages.get"
      },
      "x-parser-unique-object-id": "leaderboard_player_slots"
    }
  },
  "operations": {
    "get_save_data_info": {
      "action": "send",
      "channel": "$ref:$.channels.save_data_info",
      "summary": "Retrieve the save data information for the current user. This will return a list of JSON objects with file names and dates.",
      "messages": [
        "$ref:$.channels.save_data.messages.get"
      ],
      "reply": {
        "channel": "$ref:$.channels.save_data_info",
        "messages": [
          "$ref:$.channels.save_data_info.messages.save_data_info"
        ]
      },
      "bindings": {
        "http": {
          "method": "GET",
          "query": {
            "type": "object",
            "properties": {
              "regex": {
                "type": "string",
                "description": "A regular expression to filter the save data files by name. This will only return files that match the regex. If not provided, no filter will be applied.",
                "x-parser-schema-id": "<anonymous-schema-24>"
              },
              "limit": {
                "type": "integer",
                "description": "The maximum number of entries to return. If not provided, the default is 100.",
                "default": 100,
                "x-parser-schema-id": "<anonymous-schema-25>"
              },
              "offset": {
                "type": "integer",
                "description": "The number of entries to skip before returning results. If not provided, the default is 0.",
                "default": 0,
                "x-parser-schema-id": "<anonymous-schema-26>"
              },
              "ascending": {
                "type": "boolean",
                "description": "Whether to sort the results in ascending order by time saved.  If not provided, the default is false (most recent first).",
                "default": false,
                "x-parser-schema-id": "<anonymous-schema-27>"
              }
            },
            "additionalProperties": false,
            "x-parser-schema-id": "save_data_list_params"
          }
        }
      },
      "x-parser-unique-object-id": "get_save_data_info"
    },
    "upsert_save_data": {
      "action": "send",
      "channel": "$ref:$.channels.save_data",
      "summary": "Create or update the save data for the current user with the data contained within the request body.  This will create a new save data entry or update an existing one with the same file name. The reply contains the newly created save data entry.",
      "messages": [
        "$ref:$.channels.save_data.messages.new_save_data"
      ],
      "reply": {
        "channel": "$ref:$.channels.save_data",
        "messages": [
          "$ref:$.channels.save_data.messages.save_data_entry"
        ]
      },
      "bindings": {
        "http": {
          "method": "POST"
        }
      },
      "x-parser-unique-object-id": "upsert_save_data"
    },
    "get_save_data": {
      "action": "send",
      "channel": "$ref:$.channels.save_data",
      "summary": "Retrieve the save data for the current user. This will return a JSON object with the save data as defined by the game developer.",
      "messages": [
        "$ref:$.channels.save_data.messages.get"
      ],
      "reply": {
        "channel": "$ref:$.channels.save_data",
        "messages": [
          {
            "name": "save_data_entries",
            "title": "Save Data Entries",
            "summary": "Contains a list of save data entries",
            "contentType": "application/json",
            "payload": {
              "type": "array",
              "items": "$ref:$.channels.save_data.messages.save_data_entry.payload",
              "x-parser-schema-id": "<anonymous-schema-20>"
            },
            "description": "Contains a list of save data entries. This will be a JSON array with the save data entries as defined by the game developer.",
            "bindings": {
              "http": {
                "statusCode": 200,
                "headers": {
                  "type": "object",
                  "Content-Type": {
                    "type": "string",
                    "enum": [
                      "application/json"
                    ]
                  }
                }
              }
            },
            "x-parser-unique-object-id": "save_data_entries"
          }
        ]
      },
      "bindings": {
        "http": {
          "method": "GET",
          "query": "$ref:$.operations.get_save_data_info.bindings.http.query"
        }
      },
      "x-parser-unique-object-id": "get_save_data"
    },
    "insert_leaderboard_entry": {
      "action": "send",
      "channel": "$ref:$.channels.leaderboard_player_slots",
      "summary": "Create a new leaderboard entry for the user connected to the given player slot with the data contained within the request payload. The reply contains the newly created leaderboard entry.",
      "messages": [
        "$ref:$.channels.leaderboard_player_slots.messages.new_leaderboard_entry"
      ],
      "reply": {
        "channel": "$ref:$.channels.leaderboard_player_slots",
        "messages": [
          "$ref:$.channels.leaderboard_user.messages.leaderboard_entry"
        ]
      },
      "bindings": {
        "http": {
          "method": "POST"
        }
      },
      "x-parser-unique-object-id": "insert_leaderboard_entry"
    },
    "get_leaderboard_global": {
      "action": "send",
      "channel": "$ref:$.channels.leaderboard_global",
      "summary": "Retrieve leaderboard data from all users for a specific leaderboard sorted by value (score, time, etc.).  This will return a list of JSON objects with the leaderboard entries.",
      "messages": [
        "$ref:$.channels.save_data.messages.get"
      ],
      "reply": {
        "channel": "$ref:$.channels.leaderboard_global",
        "messages": [
          "$ref:$.channels.leaderboard_global.messages.leaderboard_entries"
        ]
      },
      "bindings": {
        "http": {
          "method": "GET",
          "query": {
            "type": "object",
            "properties": {
              "limit": {
                "type": "integer",
                "description": "The maximum number of entries to return. If not provided, the default is 100.",
                "default": 100,
                "x-parser-schema-id": "<anonymous-schema-21>"
              },
              "offset": {
                "type": "integer",
                "description": "The number of entries to skip before returning results. If not provided, the default is 0.",
                "default": 0,
                "x-parser-schema-id": "<anonymous-schema-22>"
              },
              "ascending": {
                "type": "boolean",
                "description": "Whether to sort the results in ascending order. If not provided, the default is false (descending order).",
                "default": false,
                "x-parser-schema-id": "<anonymous-schema-23>"
              }
            },
            "additionalProperties": false,
            "x-parser-schema-id": "leaderboard_list_query_params"
          }
        }
      },
      "x-parser-unique-object-id": "get_leaderboard_global"
    },
    "get_leaderboard_user": {
      "action": "send",
      "channel": "$ref:$.channels.leaderboard_user",
      "summary": "Retrieve leaderboard data for a specific user and leaderboard sorted by value (score, time, etc).  This will return a list of JSON objects with the leaderboard entries.",
      "messages": [
        "$ref:$.channels.save_data.messages.get"
      ],
      "reply": {
        "channel": "$ref:$.channels.leaderboard_user",
        "messages": [
          "$ref:$.channels.leaderboard_global.messages.leaderboard_entries"
        ]
      },
      "bindings": {
        "http": {
          "method": "GET",
          "query": "$ref:$.operations.get_leaderboard_global.bindings.http.query"
        }
      },
      "x-parser-unique-object-id": "get_leaderboard_user"
    },
    "get_leaderboard_player_slot": {
      "action": "send",
      "channel": "$ref:$.channels.leaderboard_player_slots",
      "summary": "Retrieve leaderboard data for a specific player slot and leaderboard sorted by value (score, time, etc).  This will return a list of JSON objects with the leaderboard entries.",
      "messages": [
        "$ref:$.channels.save_data.messages.get"
      ],
      "reply": {
        "channel": "$ref:$.channels.leaderboard_player_slots",
        "messages": [
          "$ref:$.channels.leaderboard_global.messages.leaderboard_entries"
        ]
      },
      "bindings": {
        "http": {
          "method": "GET",
          "query": "$ref:$.operations.get_leaderboard_global.bindings.http.query"
        }
      },
      "x-parser-unique-object-id": "get_leaderboard_player_slot"
    }
  },
  "components": {
    "messages": {
      "save_data_info": "$ref:$.channels.save_data_info.messages.save_data_info",
      "save_data_entry": "$ref:$.channels.save_data.messages.save_data_entry",
      "save_data_entries": "$ref:$.operations.get_save_data.reply.messages[0]",
      "new_save_data": "$ref:$.channels.save_data.messages.new_save_data",
      "leaderboard_entry": "$ref:$.channels.leaderboard_user.messages.leaderboard_entry",
      "leaderboard_entries": "$ref:$.channels.leaderboard_global.messages.leaderboard_entries",
      "new_leaderboard_entry": "$ref:$.channels.leaderboard_player_slots.messages.new_leaderboard_entry",
      "get": "$ref:$.channels.save_data.messages.get"
    },
    "schemas": {
      "save_data_info": "$ref:$.channels.save_data_info.messages.save_data_info.payload.items",
      "time_stamp": "$ref:$.channels.save_data.messages.save_data_entry.payload.properties.time_stamp",
      "save_data_payload": "$ref:$.channels.save_data.messages.save_data_entry.payload",
      "leaderboard_payload": "$ref:$.channels.leaderboard_global.messages.leaderboard_entries.payload.items",
      "leaderboard_list_query_params": "$ref:$.operations.get_leaderboard_global.bindings.http.query",
      "save_data_list_params": "$ref:$.operations.get_save_data_info.bindings.http.query"
    },
    "parameters": {
      "player_slot": "$ref:$.channels.save_data.parameters.player_slot",
      "user_id": "$ref:$.channels.leaderboard_user.parameters.user_id",
      "leaderboard_name": "$ref:$.channels.leaderboard_global.parameters.leaderboard_name"
    },
    "messageTraits": {
      "commonHeaders": {
        "headers": {
          "type": "object",
          "properties": {
            "my-app-header": {
              "type": "integer",
              "minimum": 0,
              "maximum": 100,
              "x-parser-schema-id": "<anonymous-schema-32>"
            }
          },
          "x-parser-schema-id": "<anonymous-schema-31>"
        }
      }
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  