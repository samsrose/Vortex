import * as _ from 'lodash';
import * as React from 'react';
import {OverlayTrigger} from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

export interface IBaseProps {
  triggerRef?: (ref: HTMLElement) => void;
  getBounds: () => ClientRect;
  orientation: 'vertical' | 'horizontal';
  shouldUpdatePosition?: boolean;
}

export type IProps = IBaseProps & typeof OverlayTrigger.prototype.props;

/**
 * custom variant of the overlay trigger that automatically chooses the placement
 * of the popover based on the position on the screen.
 *
 * This still uses an "orientation" of horizontal or vertical to pick the dimension
 * on which to move.
 *
 * The prop "getBounds" is used to retrieve the bounding rect used to determine the
 * placement. We can't use the container for this as the container may be a scrolling
 * control and not having to scroll to see the popover is the whole point of this.
 *
 * Right now the placement is only calculated when the popover is opened, it isn't updated
 * as a result of scrolling/resizing while the popover is open
 *
 * @class MyOverlayTrigger
 * @extends {React.Component<any, { placement: string }>}
 */
class MyOverlayTrigger extends React.Component<IProps, { placement: string }> {
  private mNode: Element;

  constructor(props) {
    super(props);

    this.state = {
      placement: props.orientation === 'horizontal' ? 'right' : 'bottom',
    };
  }

  public componentDidMount() {
    this.mNode = ReactDOM.findDOMNode(this) as Element;
  }

  public render() {
    const { placement } = this.state;
    const relayProps: any =
      _.omit(this.props, ['getBounds', 'placement', 'onEnter', 'triggerRef']);
    return (
      <OverlayTrigger
        placement={placement}
        onEnter={this.onEnter}
        ref={this.props.triggerRef}
        {...relayProps}
      >
        {this.props.children}
      </OverlayTrigger>
    );
  }

  private onEnter = () => {
    if (this.mNode) {
      const bounds: ClientRect = this.props.getBounds();
      if (this.props.orientation === 'horizontal') {
        const rightOfMid =
          this.mNode.getBoundingClientRect().left > bounds.left + bounds.width / 2;
        this.setState({
          placement: rightOfMid ? 'left' : 'right',
        });
      } else {
        const belowMid =
          this.mNode.getBoundingClientRect().top > bounds.top + bounds.height / 2;
        this.setState({
          placement: belowMid ? 'top' : 'bottom',
        });
      }
    }
    if (this.props.onEnter) {
      this.props.onEnter();
    }
  }
}

export default MyOverlayTrigger;
