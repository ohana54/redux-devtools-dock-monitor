import React, { cloneElement, Component, PropTypes } from 'react';
import Dock from 'react-dock';
import { POSITIONS } from './constants';
import { toggleVisibility, changePosition, changeSize } from './actions';
import reducer from './reducers';

export default class DockMonitor extends Component {
  static reducer = reducer;

  static propTypes = {
    defaultPosition: PropTypes.oneOf(POSITIONS).isRequired,
    defaultIsVisible: PropTypes.bool.isRequired,
    defaultSize: PropTypes.number.isRequired,
    toggleVisibilityKey: PropTypes.string.isRequired,
    changePositionKey: PropTypes.string.isRequired,
    children: PropTypes.element,

    dispatch: PropTypes.func,
    monitorState: PropTypes.shape({
      position: PropTypes.oneOf(POSITIONS).isRequired,
      size: PropTypes.number.isRequired,
      isVisible: PropTypes.bool.isRequired,
      childMonitorState: PropTypes.any
    })
  };

  static defaultProps = {
    defaultIsVisible: true,
    defaultPosition: 'right',
    defaultSize: 0.3
  };

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (!e.ctrlKey) {
      return;
    }

    const key = e.keyCode || e.which;
    const char = String.fromCharCode(key);
    switch (char.toUpperCase()) {
    case this.props.toggleVisibilityKey.toUpperCase():
      e.preventDefault();
      this.props.dispatch(toggleVisibility());
      break;
    case this.props.changePositionKey.toUpperCase():
      e.preventDefault();
      this.props.dispatch(changePosition());
      break;
    default:
      break;
    }
  }

  handleSizeChange(requestedSize) {
    this.props.dispatch(changeSize(requestedSize));
  }

  render() {
    const { monitorState, children, ...rest } = this.props;
    const { position, isVisible, size } = monitorState;
    const childProps = {
      ...rest,
      monitorState: monitorState.childMonitorState
    };

    return (
      <Dock position={position}
            isVisible={isVisible}
            size={size}
            onSizeChange={this.handleSizeChange}
            dimMode='none'>
        {cloneElement(children, childProps)}
      </Dock>
    );
  }
}
