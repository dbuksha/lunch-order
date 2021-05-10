import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

const StyledPaper = withStyles((theme: Theme) => ({
  root: {
    padding: 15,
    [theme.breakpoints.down('xs')]: {
      padding: 7,
    },
  },
}))(Paper);

export default StyledPaper;
