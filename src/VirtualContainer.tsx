import * as React from 'react'

type VirtualizationPropType = {
  rowHeight: number
  renderAround?: number
}

export interface VirtualContainerProps<T> {
  value: T[]
  virtualization: VirtualizationPropType
  onScrolledToBottom?: () => void
  onScrolledToTop?: () => void
  childKey: keyof T
  children: (data: T) => JSX.Element
}

export interface VirtualContainerState {
  scrollTop: number
  containerHeight: number
}

function calculateStuff(
  containerHeight: number,
  scrollTop: number,
  virtualization: VirtualizationPropType,
  dataLength: number
) {
  const top = scrollTop
  const renderAround = virtualization.renderAround ? virtualization.renderAround : 5
  const firstIndexOnScreen = Math.max(Math.floor(top / virtualization.rowHeight) - renderAround, 0)
  const lastIndexOnScreen = Math.min(
    Math.ceil(containerHeight / virtualization.rowHeight) + firstIndexOnScreen + renderAround * 2,
    dataLength
  )
  const firstBlockHeight = firstIndexOnScreen * virtualization.rowHeight
  const lastBlockHeight = (dataLength - lastIndexOnScreen) * virtualization.rowHeight
  return { firstBlockHeight, lastBlockHeight, firstIndexOnScreen, lastIndexOnScreen }
}

class VirtualContainer<T> extends React.Component<
  VirtualContainerProps<T> & { _type: 'tbody' | 'div' },
  VirtualContainerState
> {
  state = {
    containerHeight: window.innerHeight,
    scrollTop: 0
  }
  render() {
    const { firstBlockHeight, lastBlockHeight, firstIndexOnScreen, lastIndexOnScreen } = calculateStuff(
      this.state.containerHeight,
      this.state.scrollTop,
      this.props.virtualization,
      this.props.value.length
    )
    if (this.props._type === 'tbody') {
      return (
        <tbody>
          <tr style={{ height: firstBlockHeight }} />
          {this.props.value.slice(firstIndexOnScreen, lastIndexOnScreen).map(value => {
            const key = value[this.props.childKey].toString()
            return <React.Fragment key={key}>{this.props.children(value)}</React.Fragment>
          })}
          <tr style={{ height: lastBlockHeight }} />
        </tbody>
      )
    } else {
      return (
        <div style={{ paddingTop: firstBlockHeight, paddingBottom: lastBlockHeight }}>
          {this.props.value.slice(firstIndexOnScreen, lastIndexOnScreen).map(value => {
            const key = value[this.props.childKey].toString()
            return <React.Fragment key={key}>{this.props.children(value)}</React.Fragment>
          })}
        </div>
      )
    }
  }
  onScroll = () => {
    if (window.scrollY > document.body.scrollHeight - window.innerHeight) {
      if (this.props.onScrolledToBottom) this.props.onScrolledToBottom()
    } else if (window.scrollY <= 0) {
      if (this.props.onScrolledToTop) this.props.onScrolledToTop()
    }
    this.setState({ scrollTop: window.scrollY })
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }
  componentDidMount() {
    this.setState({
      containerHeight: window.innerHeight,
      scrollTop: 0
    })
    window.addEventListener('scroll', this.onScroll)
  }
}

export function List<T>(props: VirtualContainerProps<T>) {
  return <VirtualContainer {...props} _type="div" />
}

export function TBody<T>(props: VirtualContainerProps<T>) {
  return <VirtualContainer {...props} _type="tbody" />
}
