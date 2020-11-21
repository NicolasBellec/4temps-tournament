// @flow

import React, { Component } from 'react'
import type { ElementType } from 'react'
import { Loader } from 'semantic-ui-react'

type Props<T> = {
  load: (args?: T) => void,
  shouldLoad: boolean,
  Child: ElementType,
  loadArgs?: T,
  ...
}

class PreloadContainer<T> extends Component<Props<T>> {
  componentDidMount() {
    const { load, shouldLoad, loadArgs } = this.props
    if (shouldLoad) {
      load(loadArgs)
    }
  }

  // TODO: Change the pattern
  componentWillReceiveProps<T>(nextProps: Props<T>) {
    const { load, shouldLoad } = nextProps
    if (shouldLoad && shouldLoad !== this.props.shouldLoad) {
      load()
    }
  }

  render() {
    const { shouldLoad, Child, ...rest } = this.props
    if (shouldLoad) {
      return <Loader active />
    }
    return <Child {...rest} />
  }
}

export default PreloadContainer
