export const isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') next();
    else res.status(403).json({ message: 'Admin only' });
  };
  
  export const isCoordinator = (req, res, next) => {
    if (req.user?.role === 'club_coordinator') next();
    else res.status(403).json({ message: 'Coordinator only' });
  };
  