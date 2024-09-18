Differences from original babel-plugin-lodash:
1. Don't check if imported lodash function exists. From my opinion it should be done by bundler out of box (e.g. webpack) or typescript.
2. Drop support of lodash/compat since it's deprecated by lodash itself.