import fs from 'fs-extra'
import path from 'path'

class DistributionConfig {
  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  constructor () {
    this.cache = undefined
  }

  /* ****************************************************************************/
  // Loading
  /* ****************************************************************************/

  load () {
    if (this.cache === undefined) {
      try {
        this.cache = fs.readJsonSync(path.join(__dirname, '../../app/distributionConfig.json'))
      } catch (ex) {
        this.cache = {}
      }
    }
    return this.cache
  }

  /* ****************************************************************************/
  // Properties
  /* ****************************************************************************/

  get installMethod () {
    return this.load().installMethod || 'unknown'
  }
}

export default new DistributionConfig()
