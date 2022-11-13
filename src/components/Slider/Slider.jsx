import { Navigation, Pagination } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import s1 from "../../assets/s1.png";
import s2 from "../../assets/s2.png";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-fade";

import styles from "./Slider.module.scss";

const Slider = () => {
  return (
    <div className={styles.sliderContainer}>
      <Swiper
        className={styles.slideWrapper}
        loop={true}
        autoplay={{ delay: 3000 }}
        effect={"fade"}
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        <SwiperSlide className={styles.slide}>
          {" "}
          <div className={styles.slideContent}>
            <img src={s1} alt="illustration" />{" "}
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          {" "}
          <div className={styles.slideContent}>
            <img src={s2} alt="Illustration" />
          </div>{" "}
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;
