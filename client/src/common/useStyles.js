/**
 * スタイルシートをまとめるコンポーネントファイル
 */
import { makeStyles } from '@material-ui/core/styles';

/**
 * UseStylesコンポーネント
 */
const UseStyles = makeStyles (theme => ({
      card: {
          maxWidth: 600,
          height: 600
      },
      media: {
          height: 400,
      },
      button: {
          margin: theme.spacing(1),
      },
      input: {
          display: 'none',
      },
      container: {
          display: 'flex',
          flexWrap: 'wrap',
      },
      formControl: {
          margin: theme.spacing(1),
          display: 'table-cell'
      },
      paper: {
          position: 'absolute',
          width: 600,
          backgroundColor: theme.palette.primary.light,
          boxShadow: 'none',
          padding: 4,
      },
}));

export default UseStyles;