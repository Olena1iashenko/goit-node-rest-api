const ctrlWrapper = (controller) => {
  const func = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      console.error("Async function error:", error);
      next(error);
    }
  };

  return func;
};

export default ctrlWrapper;
