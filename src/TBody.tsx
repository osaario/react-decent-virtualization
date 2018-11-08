import * as React from 'react'
import { VirtualizationPropType } from './VirtualizationPropType';

export interface TBodyProps<T> {
  value: T[]
  virtualization: VirtualizationPropType 
  childKey: keyof T
  children: (
    data: T,
  ) => JSX.Element
}

export class TBody<T> extends React.Component<TBodyProps<T>> {
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
          <tbody>
            <tr style={{ height: firstBlockHeight }} />
            {this.props.value.slice(firstIndexOnScreen, lastIndexOnScreen).map(value => {
              const key = value[this.props.childKey].toString()
              return (
                <React.Fragment key={key}>
                  {this.props.children(
                    value,
                  )}
                </React.Fragment>
              )
            })}
            <tr style={{ height: lastBlockHeight }} />
          </tbody>
        )
    }
  }
