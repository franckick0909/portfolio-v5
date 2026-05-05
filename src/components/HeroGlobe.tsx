"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function HeroGlobe() {
  const chartRef = useRef<am5.Root | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    let root = am5.Root.new(containerRef.current);
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0
      })
    );

    // Create main polygon series for countries
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true,
      fill: am5.color(0x333333), // Couleur des pays (gris foncé/noir)
      fillOpacity: 1,
      strokeWidth: 0.5,
      stroke: am5.color(0xffffff),
      strokeOpacity: 0.2
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    // Create series for background fill (l'océan)
    let backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
    );
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x000000), // Noir ou gris très clair pour faire ressortir ? Mettons transparent avec ombre
      fillOpacity: 0.05,
      strokeOpacity: 0
    });
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    let graticuleSeries = chart.series.unshift(
      am5map.GraticuleSeries.new(root, {
        step: 10
      })
    );
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x000000),
      strokeOpacity: 0.1
    });

    // Set up events
    let previousPolygon: am5map.MapPolygon | undefined;

    polygonSeries.mapPolygons.template.on("active", function(active, target) {
      if (previousPolygon && previousPolygon != target) {
        previousPolygon.set("active", false);
      }
      if (target?.get("active")) {
        const dataContext = target.dataItem?.dataContext as { id?: string };
        if (dataContext?.id) {
          selectCountry(dataContext.id);
        }
      }
      previousPolygon = target;
    });

    function selectCountry(id: string) {
      let dataItem = polygonSeries.getDataItemById(id);
      if(!dataItem) return;
      let target = dataItem.get("mapPolygon");
      if (target) {
        let centroid = target.geoCentroid();
        if (centroid) {
          chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
          chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
        }
      }
    }

    // Animation de rotation de base (qui tourne doucement)
    let rotationAnimation = chart.animate({
      key: "rotationX",
      from: 0,
      to: 360,
      duration: 30000,
      loops: Infinity,
      easing: am5.ease.linear
    });

    // Arrêter la rotation si on clique sur un pays
    polygonSeries.mapPolygons.template.events.on("click", () => {
      if (rotationAnimation) {
        rotationAnimation.stop();
      }
    });

    chart.appear(1000, 100);

    // Optimisation de performance : Pause de l'animation hors écran
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (rotationAnimation) {
            rotationAnimation.play();
          }
        } else {
          if (rotationAnimation) {
            rotationAnimation.pause();
          }
        }
      });
    }, { threshold: 0.1 });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      root.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full aspect-square max-w-[450px] max-h-[450px] mx-auto rounded-full overflow-clip shadow-2xl shadow-black/80" />;
}
