// Simple Arithmetics Grammar
// ==========================
//
// Accepts expressions like "2 * (3 + 4)" and computes their value.

Save
 = _ e:EntryGroup "}"? _ { return e; }

EntryGroup
 = e:Entry* {
    // Handle duplicates and boxing
    const visitedSet = new Set();
    const LIST_KEY = "__list";
    const reduction = e.reduce((previousValue, currentValue) => {
      // If anonymous, add to list
      if (!Array.isArray(currentValue)) {
        currentValue = [LIST_KEY, currentValue];
      }
//      console.log(currentValue);
      let [key, value] = currentValue;
      if (previousValue.hasOwnProperty(key)) {
        if (visitedSet.has(key)) {
          // Already arrayified
          previousValue[key].push(value);
        } else {
          visitedSet.add(key);
          // Not arrayified yet
          previousValue[key] = [
            previousValue[key],
            value
          ];
        }
      } else {
        previousValue[key] = value;
      }
      return previousValue;
    }, {});
    // If all we have is a list, just return the list
    const keys = Object.keys(reduction);
    if (keys.length == 1 && keys[0] == LIST_KEY) {
      return reduction[LIST_KEY];
    } else {
      return reduction;
    }
 }

Entry
 = current:Line { return current; }
 / identifier:ID _ "{" _ e:EntryGroup _  "}" _ { return [identifier, e]; } // meaningful trees, named lists
 / identifier:ID _ "{" _ arr:List _ "}" _ { return [identifier, arr]; } // named lists
 / _ "{" _ arr:EntryGroup _ "}" _ { return arr; } // anonymous composites.
 / _ "{" _ arr:List _ "}" _ { return arr; } // anonymous lists.

Line
 = identifier:ID _ leafsymbol:Value _ { return [ identifier, leafsymbol ]; }

List
 = arr:ListElement* { return arr; }

ListElement
= e:Entry { return e; }
   / a:Value _ { return a; }

ID
  = identifier:Atomic _ "=" { return identifier; }

Value
  = _ d:Date { return d; } // Have to parse unquoted date first because ambiguous with other entries
  / _ floating:$([-]?[0-9]+"."[0-9]+) { return parseFloat(floating); }
  / _ integer:$([-]?[0-9]+) { return parseInt(integer); }
  / _ "\""d:Date"\"" { return d; }
  / Literal
  / Atomic

Date
  = year:$([0-9]+)"."month:$([0-9]+)"."date:$([0-9]+) { return new Date(year, month - 1, date) } // lol js months start at 0

Literal "literal"
  = _ "\"" literal:$[^\"\\]* "\"" { return literal; }
  / _ custom:CustomString { return custom; } // More expensive fallback to be used when encountering escapes

Atomic "atomic"
  = _ elems:$[^ \n\r\t=}{]+ { return elems; }

_ "whitespace"
  = [ \t\n\r]*"#"[^\n\r]*_
  / [ \t\n\r]*

// Formal way of handling strings
//
// Probably pretty expensive, so only handle strings heuristically detected to have an escape
// sequence in them
CustomString
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  / "'" chars:SingleStringCharacter* "'" { return chars.join(''); }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }
