import * as React from 'react'

type VirtualizationPropType = {
  rowHeight: number
  containerHeight: number
  scrollTop: number
  renderAround?: number
}

export interface VirtualContainerProps<T> {
  value: T[]
  virtualization: VirtualizationPropType
  childKey: keyof T
  children: (data: T) => JSX.Element
}

function calculateStuff(virtualization: VirtualizationPropType, dataLength: number) {
  const top = virtualization.scrollTop
  const renderAround = virtualization.renderAround ? virtualization.renderAround : 5
  const firstIndexOnScreen = Math.max(Math.floor(top / virtualization.rowHeight) - renderAround, 0)
  const lastIndexOnScreen = Math.min(
    Math.ceil(virtualization.containerHeight / virtualization.rowHeight) + firstIndexOnScreen + renderAround * 2,
    dataLength
  )
  const firstBlockHeight = firstIndexOnScreen * virtualization.rowHeight
  const lastBlockHeight = (dataLength - lastIndexOnScreen) * virtualization.rowHeight
  return { firstBlockHeight, lastBlockHeight, firstIndexOnScreen, lastIndexOnScreen }
}

export class TBody<T> extends React.Component<VirtualContainerProps<T>> {
  render() {
    const { firstBlockHeight, lastBlockHeight, firstIndexOnScreen, lastIndexOnScreen } = calculateStuff(
      this.props.virtualization,
      this.props.value.length
    )
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
  }
}

export class List<T> extends React.Component<VirtualContainerProps<T>> {
  render() {
    const { firstBlockHeight, lastBlockHeight, firstIndexOnScreen, lastIndexOnScreen } = calculateStuff(
      this.props.virtualization,
      this.props.value.length
    )
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
