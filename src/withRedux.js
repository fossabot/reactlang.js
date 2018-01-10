
import { connect } from 'react-redux';

function withRedux(Component) {
    return Component;
}

const mapStateToProps = ({ lang }) => ({ lang });

export default connect(mapStateToProps)(withRedux);
