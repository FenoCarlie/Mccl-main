import { useContextMenu, MenuItem } from "react-contextmenu";

const ContextMenu = ({ id, handleProjetClick, handleModifierClick }) => {
  const { show } = useContextMenu({ id });

  return (
    <div>
      {show && (
        <div>
          <MenuItem onClick={handleProjetClick}>Projet</MenuItem>
          <MenuItem onClick={handleModifierClick}>Modifier</MenuItem>
        </div>
      )}
    </div>
  );
};
