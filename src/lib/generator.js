import isValid from 'is-valid-app'

import { task } from './utils/utils'

import generateDefaults from 'generate-defaults'
import generateDest from 'generate-dest'

import generateSubgeneratorExample from './subgenerators/generate-subgenerator-example/generator'

import promptTask from './tasks/prompt'

export default function (app) {
  if (!isValid(app, 'generate-swap-browser-lib')) return

  app.on('error', err => app.log.error(err))

  /**
   * Use Plugins
   */
  app.use(generateDefaults)

  /**
   * Register Sub Generators
   */
  app.register('destination-directory', generateDest)
  app.register('subgenerator-example', generateSubgeneratorExample)

  /**
   * Run main task swap-browser-lib. Also aliased as the [default](#default) task.
   *
   * ```sh
   * $ gen swap-browser-lib:main
   * ```
   * @name main
   * @api public
   */
  app.task('main', function (cb) {
    app.generate([
      'prompt',
      'dest',
      'subgenerator-example',
      'example'
    ], cb)
  })

  /**
   * Ask the user for all the required data for all the tasks in this generator.
   *
   * ```sh
   * $ gen swap-browser-lib:prompt
   * ```
   * @name prompt
   * @api public
   */
  app.task('prompt', promptTask(app))

  /**
   * Set the destination directory for generated files.
   * Call the `destination-directory:default` task from the sub generator `destination-directory`.
   *
   * ```sh
   * $ gen swap-browser-lib:dest
   * ```
   * @name dest
   * @api public
   */
  app.task('dest', function (cb) {
    app.generate(['destination-directory:default'], cb)
  })

  app.task('subgenerator-example', function (cb) {
    app.generate(['subgenerator-example:default'], cb)
  })

  /**
   * Define the example task
   *
   * ```sh
   * $ gen swap-browser-lib:example
   * ```
   * @name dest
   * @api public
   */
  task(app, 'example', 'example.txt')

  /**
   * Run the default task
   *
   * ```sh
   * $ gen swap-browser-lib:default
   * ```
   *
   * or simply
   *
   * ```sh
   * $ gen swap-browser-lib
   * ```
   * @name default
   * @api public
   */
  app.task('default', ['main'])
}
