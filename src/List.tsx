
import * as React from 'react'
import { VirtualizationPropType } from './VirtualizationPropType';

export interface ListProps<T> {
  value: T[]
  virtualization: VirtualizationPropType 
  childKey: keyof T
  children: (
    data: T,
  ) => JSX.Element
}

export class List<T> extends React.Component<ListProps<T>> {
  render() {
      const top = this.props.virtualization.scrollTop
      const renderAround = this.props.virtualization.renderAround ? this.props.virtualization.renderAround : 5
      const firstIndexOnScreen = Math.max(Math.floor(top / this.props.virtualization!.rowHeight) - renderAround, 0)
      const lastIndexOnScreen = Math.min(
        Math.ceil(this.props.virtualization.containerHeight / this.props.virtualization.rowHeight) +
          firstIndexOnScreen +
          renderAround * 2,
        this.props.value.length
      )
      const firstBlockHeight = firstIndexOnScreen * this.props.virtualization.rowHeight
      const lastBlockHeight = (this.props.value.length - lastIndexOnScreen) * this.props.virtualization.rowHeight
        return (
          <div style={{ paddingTop: firstBlockHeight, paddingBottom: lastBlockHeight }}>
            {this.props.value.slice(firstIndexOnScreen, lastIndexOnScreen).map(value => {
              const key = value[this.props.childKey].toString()
              return (
                <React.Fragment key={key}>
                  {this.props.children(
                    value
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )
    }
  }
