
export default {
  protectChart:{
    a1:[
      {
        "bool": {
          "should": [
            {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:>0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:400"
                    }
                  }
                ]
              }
            },
            {
              "bool": { //error_code=0
                "must": [{
                  "query_string": {
                    "query": "shadow.access.response_code:200"
                  }
                }, {
                  "query_string": {
                    "query": "shadow.access.org_url:\\/402\\.html"
                  }
                }]
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:444"
              }
            }
          ]
        }
      },
    ],
    a2:[// 
      {
        "bool": {
          "should": [
            {
              "bool": {
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:>0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:400"
                    }
                  }
                ]
              }
            },
            {
              "bool": {
                "must": [{
                  "query_string": {
                    "query": "shadow.access.response_code:200"
                  }
                }, {
                  "query_string": {
                    "query": "shadow.access.org_url:\\/402\\.html"
                  }
                }]
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:405"
              }
            }
          ]
        }
      }
    ]
  },
  monitorChart:{// 
    a1:[
      {
        "query_string": {
          "query": "shadow.access.error_code:>0"
        }
      },
      {
        "query_string": {
          "query": "shadow.access.response_code:200"
        }
      },
      {"query_string":{"query":"shadow.access.shadow_learning_mode:1"}}
    ],
    a2:[//
      {
        "query_string": {
          "query": "shadow.access.error_code:>0"
        }
      },
      {
        "query_string": {
          "query": "shadow.access.response_code:200"
        }
      },
      {"query_string":{"query":"shadow.access.shadow_learning_mode:1"}}
    ]
  }
}
