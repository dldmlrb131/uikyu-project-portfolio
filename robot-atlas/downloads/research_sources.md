# 현장·공간 로봇 데이터 조사 근거

확인일: 2026-11-01. 공식 자료·원논문·공식 영상 메타데이터 중심.

- [IfcOpenShell · geometry processing](https://docs.ifcopenshell.org/ifcopenshell-python/geometry_processing.html) — BIM: IFC 형상을 mesh로 추출. 의미·단위·placement는 별도로 유지한다. (공식 자료 확인)

- [IfcOpenShell · units](https://docs.ifcopenshell.org/autoapi/ifcopenshell/util/unit/index.html) — BIM: 모델 길이 단위를 SI로 환산하는 유틸리티. (공식 자료 확인)

- [IfcOpenShell · placement](https://docs.ifcopenshell.org/autoapi/ifcopenshell/util/placement/index.html) — BIM: 중첩된 local placement의 행렬. 중심점·로봇 목표와 동일하지 않다. (공식 자료 확인)

- [COLMAP · SfM/MVS](https://colmap.github.io/tutorial.html) — 재구성: 사진에서 카메라 자세·희소/밀집 형상. metric scale은 기준 거리 등으로 검증. (공식 자료 확인)

- [VGGT · visual geometry](https://github.com/facebookresearch/vggt) — AI: CVPR 2025, 카메라·깊이·점군 추정. 공개 README 및 적용 경로 확인. (공식 자료 확인)

- [SAM 3 · concept segmentation](https://github.com/facebookresearch/sam3) — AI: 개념·시각 프롬프트로 이미지/영상 영역 추출. custom license와 모델 조건 확인. (공식 자료 확인)

- [FoundationStereo](https://github.com/NVlabs/FoundationStereo) — AI: 보정·rectification된 stereo 입력과 baseline이 필요. (공식 자료 확인)

- [Fast-FoundationStereo](https://github.com/NVlabs/Fast-FoundationStereo) — AI: CVPR 2026 저장소. 실시간성은 해상도·GPU·정밀도·실제 pipeline으로 검증. (공식 자료 확인)

- [FoundationPose](https://github.com/NVlabs/FoundationPose) — AI: 물체의 6D pose 추정·추적. CAD 또는 지원 reference 입력 경로를 확인. (공식 자료 확인)

- [Qwen3-VL](https://github.com/QwenLM/Qwen3-VL) — AI: 로컬 멀티모달 이해 후보. checkpoint별 메모리·라이선스·정확도 평가 필요. (공식 자료 확인)

- [Hydra · 3D scene graphs](https://github.com/MIT-SPARK/Hydra) — 공간 의미: 공간·객체·장소를 계층 graph로 구성하는 연구 시스템. (공식 자료 확인)

- [FOUND-IT](https://github.com/MIT-SPARK/FOUND-IT) — 공간 의미: foundation model 기반 task-driven scene graph 코드 공개 상태 확인. 현장 범용성은 별도 검증. (2026 연구 저장소)

- [Foundation-Model-Driven 3D Scene Graphs](https://arxiv.org/abs/2610.23622) — 논문: 2026년 10월 사전 공개 연구. 검증되지 않은 범용 산업 솔루션으로 취급하지 않는다. (최근 사전 공개)

- [FAST-LIO](https://github.com/hku-mars/FAST_LIO) — SLAM: LiDAR-IMU odometry. point별 시각·IMU 외부 보정·센서 지원 확인. (공식 자료 확인)

- [RTAB-Map ROS](https://github.com/introlab/rtabmap_ros) — SLAM: RGB-D/stereo/LiDAR 등 입력별 구성과 ROS 브랜치 확인. (공식 자료 확인)

- [cuVSLAM 연구](https://arxiv.org/abs/2506.04359) — SLAM: CUDA 기반 visual-inertial 위치 추정 연구. 지원 센서·보정·실행환경 확인. (공식 자료 확인)

- [Isaac ROS](https://developer.nvidia.com/isaac/ros) — 로봇 실행: perception·pose·mapping·motion 도구군. release와 JetPack/ROS/GPU 지원을 함께 고정. (공식 자료 확인)

- [Isaac ROS nvblox](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_nvblox/index.html) — 로봇 실행: dense 재구성과 거리/비용 지도 연결. 정적·동적 처리 설정 및 입력 pose 확인. (공식 자료 확인)

- [nvblox core](https://github.com/nvidia-isaac/nvblox) — 로봇 실행: TSDF/ESDF GPU mapping. core·ROS wrapper·Python API 버전을 구분. (공식 자료 확인)

- [NVIDIA R²D² workflow](https://developer.nvidia.com/blog/r2d2-building-ai-based-3d-robot-perception-and-mapping-with-nvidia-research/) — 통합 예시: cuVSLAM·FoundationStereo·feature fusion을 연결한 제공자 reference workflow. (공식 자료 확인)

- [Open3D · ICP](https://www.open3d.org/docs/release/tutorial/pipelines/icp_registration.html) — 점군 가공: 대응점·초기값·fitness·잔차를 검사. ICP 수렴만으로 절대 정확도 보장 안 됨. (공식 자료 확인)

- [3D Gaussian Splatting](https://github.com/graphdeco-inria/gaussian-splatting) — 재구성: 시점 렌더링용 표현. 충돌·접촉 geometry로 자동 전환되는 것은 아님. 사용 조건 별도 확인. (공식 자료 확인)

- [OpenUSD](https://openusd.org/release/index.html) — 시뮬레이션: 장면 구성·geometry·physics schema. 물리 속성과 robot articulation은 별도 작성·검증. (공식 자료 확인)

- [Open-RMF demos](https://github.com/open-rmf/rmf_demos) — 시설 연계: 로봇 fleet·교통·문·엘리베이터 등 공유 자원 통합의 예. (공식 자료 확인)

- [Nav2](https://nav2.org/) — 로봇 실행: 위치 추정·map·footprint·controller·실제 obstacle 관측을 연결. (공식 자료 확인)

- [MoveIt](https://moveit.ai/documentation/concepts/) — 로봇 실행: pose를 관절 경로·충돌 검사·실행으로 연결하는 기반. (공식 자료 확인)

- [MCAP](https://mcap.dev/guides) — 데이터: 원시 시계열·schema·시각을 보존하는 컨테이너. (공식 자료 확인)

- [LeRobotDataset](https://github.com/huggingface/lerobot/blob/main/docs/source/lerobot-dataset-v3.mdx) — 학습: 로봇 관측·행동·episode metadata. 실제 action 의미·단위·통계를 맞춰야 함. (공식 자료 확인)

- [ScanNet](https://github.com/ScanNet/ScanNet) — 공개 데이터: 실내 3D 인식 연구용. 접근·다운로드·라이선스 조건 확인. (공식 자료 확인)

- [ScanNet++](https://github.com/scannetpp/scannetpp) — 공개 데이터: 고품질 indoor scene 연구 데이터와 처리 도구. 현장 동작 시연의 대체 아님. (공식 자료 확인)

- [ARKitScenes](https://github.com/apple-aiml-research/ARKitScenes) — 공개 데이터: 모바일 RGB-D 실내 데이터. calibration·pose·3D annotation 활용. (공식 자료 확인)

- [Replica](https://github.com/facebookresearch/Replica-Dataset) — 공개 데이터: 실내 장면 geometry·semantic 연구 자산. 라이선스·모델 용도 확인. (공식 자료 확인)

- [Atlas 공식 제품](https://bostondynamics.com/products/atlas/) — 장비: 2026 제품 방향과 산업 작업 범위. 공개 소개는 센서 배치·내부 제어 API 공개를 의미하지 않음. (공식 자료 확인)

- [Atlas 제품 발표 · 2026-01-05](https://bostondynamics.com/blog/boston-dynamics-unveils-new-atlas-robot-to-revolutionize-industry/) — 장비: 제공자의 제품 발표·도입 계획. 완료된 광범위 현장 보급과 구분. (공식 자료 확인)

- [Turner · construction Spot pilot](https://www.turnerconstruction.com/insights/advancing-robotics-in-construction-spot) — 현장 사례: 시공 진행 기록·현장 스캔·as-built BIM pilot. 고객/시공사 원문. (공식 자료 확인)

- [National Grid · Spot inspection](https://bostondynamics.com/case-studies/spot-becomes-part-of-the-team-at-national-grid/) — 현장 사례: 광학·열화상 기반 설비 점검. 제조사 고객 사례이며 독립 성능 시험 아님. (공식 자료 확인)

- [Leica BLK ARC spec v1.4](https://shop.leica-geosystems.com/sites/default/files/2025-02/BLKARC_SpecSheet_v1.4_updates.pdf) — 장비: 로봇 탑재 스캐너·전원·시야·정확도 조건. controlled environment와 range noise를 구분. (공식 자료 확인)

- [FARO Orbis](https://www.faro.com/Products/Hardware/FARO-Orbis-Mobile-Laser-Scanner) — 장비: 이동 SLAM·정지 Flash workflow. 제품 variant·precision 조건·출력 라이선스 확인. (공식 자료 확인)

- [Trimble X7/X9 운영](https://help.fieldsystems.trimble.com/fieldlink/scan-settings-X7-X9.htm) — 장비: 고정 스캔의 calibration·leveling·온도 절차. 현재 robot integration은 별도 확인. (공식 자료 확인)

- [HP SitePrint · workflow](https://www.hp.com/gb-en/printers/site-print/how-does-site-print-construction-layout-robot-work.html) — 시공: 2D CAD와 현장 control·robotic total station을 바닥 출력으로 연결. (공식 자료 확인)

- [HP SitePrint 공식 영상 목록](https://www.hp.com/us-en/printers/site-print/layout-robot/videos.html) — 현장 사례: 공식 페이지의 영상 ID와 YouTube oEmbed 제목·게시자 확인. (공식 자료 확인)

- [Hilti Jaibot](https://www.hilti.com/content/hilti/W1/US/en/business/business/trends/jaibot.html) — 시공: BIM-to-field semi-automated drilling. total station·작업 구역·장비 지원 확인. (공식 자료 확인)

- [ANYmal offshore pilot](https://www.anybotics.com/news/worlds-first-autonomous-offshore-robot/) — 현장 사례: 시각·열·음향 등 반복 설비 점검과 지도/inspection point 설정 사례. (공식 자료 확인)

- [Livox Mid-360](https://www.livoxtech.com/mid-360) — 장비: 점군·센서 설정·시야·반사율 조건 확인. survey-grade as-built scanner와 용도 구분. (공식 자료 확인)

- [Ouster OS0](https://ouster.com/products/hardware/os0-lidar-sensor) — 장비: 3D LiDAR의 입력·시야·sensor generation·calibration 정보 확인. (공식 자료 확인)

- [RealSense D450 series](https://www.realsenseai.com/product-family/450-series/) — 장비: stereo depth·SDK·보정·노출·결측·거리 성능을 작업 환경에서 확인. (공식 자료 확인)

- [NVIDIA Jetson Orin](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/) — 장비: edge inference 후보. TOPS는 실제 pipeline throughput·지연의 대체 지표 아님. (공식 자료 확인)

## 영상 확인

공식 페이지·YouTube oEmbed로 제목·게시자·URL·썸네일 확인. 전 구간 시청·현장 성능 검증을 수행한 것은 아님.

- [How to Scan with the Leica BLK ARC: Overview with Andy Fontana](https://www.youtube.com/watch?v=hHDuxdIPkqk) — Leica Geosystems Reality Capture Hardware / 공식 장비 workflow
- [Leica BLK ARC and Boston Dynamics Spot: Fully Autonomous Reality Capture](https://www.youtube.com/watch?v=aq5SHrw6WSk) — Leica Geosystems Reality Capture Hardware / 제조사 데모
- [Transform 3D Scanning with FARO® Orbis™ Mobile Scanner](https://www.youtube.com/watch?v=hQlgdm4eCAg) — FARO INSIGHT / 제품 소개
- [HP SitePrint in action with Skanska at NY Penn Station | HP](https://www.youtube.com/watch?v=Kyc9vn7YwLE) — HP / 고객 현장 사례
- [HP SitePrint robot How does it work | HP](https://www.youtube.com/watch?v=VmA3pygMr9c) — HP / 공식 작동 설명
- [Why Hoar Construction Chose HP SitePrint | HP SitePrint Review | HP](https://www.youtube.com/watch?v=Bx_1xpyHyQQ) — HP / 고객 인터뷰
- [INTRODUCING a new construction robot Hilti JAIBOT for construction automation of overhead drilling](https://www.youtube.com/watch?v=ytpzbOtNo3w) — Hilti North America / 공식 장비 소개
- [High Voltage Spot Inspections at National Grid | Boston Dynamics](https://www.youtube.com/watch?v=iubgWPHsuWM) — Boston Dynamics / 고객 현장 사례
- [Deploy NVblox for Real-time 3D Mapping & Navigation on Jetson AGX Orin!](https://www.youtube.com/watch?v=_TKNGejfGIo) — Seeed AI Robotics Lab / 통합 제공자 데모
- [[CVPR 2024 highlight] FoundationPose: Unified 6D Pose Estimation and Tracking of Novel Objects](https://www.youtube.com/watch?v=Ip_yWsGUF6c) — Bowen Wen / 연구자 프로젝트 데모
- [All New Atlas | Boston Dynamics](https://www.youtube.com/watch?v=29ECwExc-_M) — Boston Dynamics / 공식 공개 영상 / 2024