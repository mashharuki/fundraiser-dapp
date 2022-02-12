/**
 * アプリ共通で使用するダイアログコンポーネントファイルになります。
 */
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Dialogコンポーネント
 * @param {*} props ダイアログに挿入する情報
 */
const Dialog = (props) => {
      // 引数から情報を取得する。
      const { onClose, key, value, open } = props;

      /**
       * ダイアログを閉じるボタンを押した時の処理
       */
      const handleClose = () => {
            onClose(value);
      };
      
      return (
            <Dialog onClose={handleClose} open={open}>
                  <DialogTitle id="alert-dialog-title">
                        Web3.0 Dialog
                  </DialogTitle>
                  <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                              {key} : {value}
                        </DialogContentText>
                  </DialogContent>
            </Dialog>
      );
};

export default Dialog;