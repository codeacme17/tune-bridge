"use client";

export const BrandCard = () => {
  const handleClick = () => {
    console.log("click");
    const url = "https://example.com";
    const windowFeatures =
      "width=400,height=300,toolbar=0,menubar=0,location=0,resizable=0,scrollbars=0,status=0";
    window.open(url, "mySmallWindow", windowFeatures);
  };

  return (
    <section>
      <div className="w-10 h-10" onClick={handleClick}>
        netease
      </div>
    </section>
  );
};
