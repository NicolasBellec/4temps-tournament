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
      if ( loadArgs !== undefined ) {
        load( loadArgs );
      }
      else {
        load();
      }
    }
  }

  componentDidUpdate(prevProps: Props<T>) {
    const { load, shouldLoad, loadArgs } = this.props;
    if ( shouldLoad && shouldLoad !== prevProps.shouldLoad ) {
      if ( loadArgs !== undefined ) {
        load( loadArgs );
      }
      else {
        load();
      }
    }
  }

  render() {
    const { shouldLoad, Child, ...rest } = this.props
    if (shouldLoad) {
      return <Loader active />
    }
    // $FlowFixMe
    return <Child {...rest} />
  }
}

export default PreloadContainer
