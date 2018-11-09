import * as React from 'react'

export interface ScrollContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: (scrollTop: number, containerHeight: number) => JSX.Element
}

export class ScrollContainer extends React.Component<
  ScrollContainerProps,
  { scrollTop: number | null; containerHeight: number | null }
> {
  virtualizationRef = React.createRef<HTMLDivElement>()
  state = {
    scrollTop: null,
    containerHeight: null
  }
  onScroll = (e: any) => {
    const elem = e.target as any
    this.setState({ scrollTop: elem.scrollTop })
  }

  // expose scrollTo !!!!

  render() {
    const { children, ...restProps } = this.props
    return (
      <div
        {...restProps}
        ref={this.virtualizationRef}
        onScroll={this.onScroll}
        style={{
          width: '100%',
          height: '100%',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          ...restProps.style,
          overflow: 'scroll',
          WebkitOverflowScrolling: 'touch',
          position: 'absolute'
        }}
      >
        {this.state.scrollTop != null &&
          this.state.containerHeight != null &&
          children(this.state.scrollTop!, this.state.containerHeight!)}
      </div>
    )
  }
  onResize = () => {
    const rect = this.virtualizationRef.current!.getBoundingClientRect()
    this.setState({
      containerHeight: rect.bottom - rect.top
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }
  componentDidMount() {
    const rect = this.virtualizationRef.current!.getBoundingClientRect()
    this.setState({
      containerHeight: rect.bottom - rect.top,
      scrollTop: 0
    })
    window.addEventListener('resize', this.onResize)
  }
}
