/**
 * スタイルシートをまとめるコンポーネントファイル
 */
import { blue } from '@material-ui/core/colors';
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
    bodyColor: {
        backgroundColor: '#5d6b92',
    },
    card: {
        maxWidth: 600,
        height: 600,
    },
    tokenCard: {
        maxWidth: 600,
        height: 300,
        backgroundColor: '#5d6b92',
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
        // backgroundColor: 'white',
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    cardContainer: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        backgroundColor: 'linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB)',
        animation: `$gradientBG 15s ease infinite`,
    },
    "@keyframes gradientBG": {
        "0%": {
            transform: "translateY(-50%)"
        },
        "50%": {
            transform: "translateY(-50%)"
        },
        "1000%": {
            transform: "translateY(-50%)"
        },
    },
    cardMedia: {
        height: 300,
    },
    swapContainer: {

    },
}));

export default UseStyles;