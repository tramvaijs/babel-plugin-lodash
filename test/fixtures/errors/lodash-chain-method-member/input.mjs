import { chain, map, mixin } from "lodash";
import value from "lodash/value";
import _ from "lodash/wrapperLodash";

mixin(_, { map: map, chain: chain, value: value });
_.chain([1,2,3]).map(x => x+1).value(); // Use the methods.