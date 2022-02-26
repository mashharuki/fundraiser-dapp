/**
 * スタイルシートをまとめるコンポーネントファイル
 */
import { makeStyles } from '@material-ui/core/styles';

/**
 * UseStylesコンポーネント
 */
const UseStyles = makeStyles (theme => ({
    root: {
        flexGrow: 1
    },
    navLink: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    toolbar: {
        backgroundColor: '#b2ebf2',
    },
    card: {
        maxWidth: 600,
        height: 600,
    },
    tokenCard: {
        maxWidth: 600,
        height: 200,
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
    main_container: {
        backgroundColor: 'white',
    }
}));

export default UseStyles;