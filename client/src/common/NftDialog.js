/**
 * NFTのページで使用するダイアログコンポーネントファイルになります。
 */
import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

/**
 * Dialogコンポーネント
 * @param {*} props ダイアログに挿入する情報
 */
const NftDialog = (props) => {

      const [ open ,setOpen ] = useState(false);
      // 引数から情報を取得する。
      const { key, value, dialogOpen } = props;
      setOpen(dialogOpen);

      /**
       * ダイアログを閉じるボタンを押した時の処理
       */
      const handleClose = () => {
            // falseにして閉じる。
            setOpen(false);
      };
      
      return (
            <Dialog onClose={handleClose} open={open}>
                  <DialogTitle id="alert-dialog-title">
                        {key}
                  </DialogTitle>
                  <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                              {key} : {value}
                        </DialogContentText>
                  </DialogContent>
            </Dialog>
      );
};

export default NftDialog;