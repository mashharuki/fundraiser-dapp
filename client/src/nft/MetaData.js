/**
 * NFTに紐づくメタデータを表示するための関数
 */

// 必要なモジュールを読み込む
import React, { useState, useEffect } from "react";
import UseStyles from "./../common/useStyles";
// Cardコンポーネントを読み込む
import Card  from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

/**
 * MetaDataコンポーネント
 * @param {*} props メタデータ
 */
const MetaData = (props) => {
      // 引数から値を取得する。
      const { metaData, owner } = props;
      // スタイル用のクラス
      const classes = UseStyles();

      useEffect(() => {
            console.log("metaData:", metaData);
            console.log("owner:", owner);
      }, []);

      return (
            <Card className={classes.card} variant="outlined">
                  <CardActionArea>
                        { metaData.URL ? ( <CardMedia className={classes.media} image={metaData.URL} title="NFT Image"/> ) : (<></>) }
                        <CardContent>
                              <Typography gutterBottom variant="h5" component="h2">
                                    {metaData.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="div">
                                    <p>
                                          owner：{owner}
                                    </p>
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="div">
                                    <p>
                                          description：{metaData.description}
                                    </p>
                              </Typography>
                        </CardContent>
                  </CardActionArea>
            </Card>
      );
};

export default MetaData;