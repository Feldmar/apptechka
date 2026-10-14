import { useState, type MouseEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import styles from './AddButton.module.scss';

const OPTION_SELECT_DATES = 'Выбрать дни для приема препарата';

const options = [OPTION_SELECT_DATES, '...'];

type AddButtonProps = {
  onSelectDates?: () => void;
};

export default function AddButton({ onSelectDates }: AddButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOption = (option: string) => {
    handleClose();
    if (option === OPTION_SELECT_DATES) {
      onSelectDates?.();
    }
  };

  return (
    <div className={styles.container}>
      <IconButton
        aria-label="Добавить"
        aria-controls={open ? 'add-menu' : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={handleClick}
        className={styles.icon}
      >
        <AddIcon fontSize="large" />
      </IconButton>
      <Menu
        id="add-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: { maxHeight: 200, width: 'min-content' },
          },
          list: { 'aria-labelledby': 'add-button' },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleOption(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
