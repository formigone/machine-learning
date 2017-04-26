twig({
  id: "newslist.twig",
  data: [{ "type": "raw", "value": "<h3>" }, {
    "type": "output",
    "stack": [{ "type": "Twig.expression.type.variable", "value": "listName", "match": ["listName"] }]
  }, { "type": "raw", "value": "</h3>\n" }, {
    "type": "logic",
    "token": {
      "type": "Twig.logic.type.for",
      "key_var": null,
      "value_var": "item",
      "expression": [{ "type": "Twig.expression.type.variable", "value": "newslist", "match": ["newslist"] }],
      "output": [{ "type": "raw", "value": "    " }, {
        "type": "logic",
        "token": {
          "type": "Twig.logic.type.include",
          "only": false,
          "ignoreMissing": false,
          "stack": [{ "type": "Twig.expression.type.string", "value": "newslist-item.twig" }],
          "withStack": [{
            "type": "Twig.expression.type.object.start",
            "value": "{",
            "match": ["{"]
          }, {
            "type": "Twig.expression.type.operator.binary",
            "value": ":",
            "precidence": 16,
            "associativity": "rightToLeft",
            "operator": ":",
            "key": "story"
          }, {
            "type": "Twig.expression.type.variable",
            "value": "item",
            "match": ["item"]
          }, { "type": "Twig.expression.type.object.end", "value": "}", "match": ["}"] }]
        }
      }]
    }
  }],
  precompiled: true
});
