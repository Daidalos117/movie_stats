import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import {StyledInside} from "./styled";

interface Props {
  open: boolean;
}

const LoadingDialog: React.FC<Props> = ({ open }) => (
  <Dialog open={open} >
    <DialogContent>
			<StyledInside>
        <CircularProgress />
      </StyledInside>
    </DialogContent>
  </Dialog>
);

export default LoadingDialog;
