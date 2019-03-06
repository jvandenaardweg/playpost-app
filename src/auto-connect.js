import { connect } from 'react-redux';

/* eslint-disable */
export const autoConnect = (Component, options) =>
  connect(
    Component && Component.mapStateToProps,
    Component && Component.mapDispatchToProps,
    Component && Component.mergeProps,
    options
  )(Component);
