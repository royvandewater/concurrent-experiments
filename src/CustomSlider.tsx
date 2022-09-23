import RcSlider, { SliderProps, SliderRef } from 'rc-slider/lib/Slider'

export const CustomSlider = RcSlider as React.ForwardRefExoticComponent<SliderProps<number> & React.RefAttributes<SliderRef>>