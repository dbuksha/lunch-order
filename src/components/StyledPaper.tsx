import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const StyledPaper = withStyles(() => ({
  root: {
    padding: 15,
  },
}))(Paper);

export default StyledPaper;
