1. **TỔNG QUAN VỀ HỆ THỐNG**
  1. **Mô tả bài toán**

    Trong những năm gần đây là sự bùng nổ của 2 nền tảng Android và IOS, kéo theo đó là một loạt những công ty lớn nhỏ đua nhau phát triển ứng dụng cho 2 nền tảng này. Với các công ty lớn họ có chi phí đầu tư cho những ứng dụng của mình nên họ có thể tách rời phát triển cho 2 nền tảng trên. Nhưng còn các công ty vừa và nhỏ, việc phát triển tách rời 2 nền tảng trở nên tốn kém. Vì vậy việc phát triển các ứng dụng mobile cross platform trở nên đáng quan tâm hơn bao giờ hết. Các ứng dụng mobile cross platform trên đc tạo ra một cách nhanh chóng với chi phí thấp hơn một nửa so với các ứng dụng phát triển tách rời.

    Trong khi có rất nhiều các ứng dụng như vậy thì việc có một nơi để lưu trữ và sử dụng chúng là rất cần thiết, một nơi mà nếu với các nhà phát triền thì đó là nơi lưu trữ, triển khai, kiểm thử ứng dụng và sử dụng các dịch vụ một cách tối giản, hiệu quả nhất mà nới đó cung cấp. Còn với người dùng thông thường là nơi để chạy ứng dụng của mình thay vì việc cài đặt từng ứng dụng vào thì nay có thể chạy trực tiếp mà không cần cài đặt thêm bất cứ thứ gì.

    Hystore được phát triển để thực hiện hóa điều đó. Hystore là nơi tối giản hóa khâu rườm rà trong quá trình tải lên, triển khai và kiểm thử dự án mà nhà phát triển phải làm. Nơi quản lý, sử dụng, tương tác một cách dễ dàng nhất đối với người dùng thông thường. Hystore còn cho tất cả mọi người có thể mở rộng để làm một store đặc trưng cho riêng mình. Hystore cung cấp giao diện web và di động thân thiện với người dùng và giao diện dòng lệnh giúp nhà phát triển có thể tiến hành tải lên, tải xuống, triển khải, kiểm thử ứng dụng của mình một cách nhanh chóng.

    Vậy làm thế nào Hystore có thể chạy các ứng dụng trực tiếp mà không cần cài đặt? Bản chất của các ứng dụng mobile cross platform là việc chúng ta viết phần mềm cho di động thông qua html, css, js được thông dịch qua một bộ máy đã được Adobe phát triển đó là Cordova. Tại đây Cordova sẽ tạo một layout để chạy html, css, js bằng những bộ đọc web có sẵn tại mỗi hệ điều hành. Vậy là mỗi một ứng dụng ta sẽ cần một layout cho từng ứng dụng. Hystore sẽ dựng sẵn một layout để chạy các chương trình vậy nên các chương trình chỉ cần tải về html, css, js là có thể chạy trực tiếp ngay mà không cần cài đặt. Thậm chí chúng ta có thể không cần tải chương trình về mà có thể chạy trực tiếp luôn.

    Vậy còn hiệu năng của các ứng dụng mobile cross platform thì sao? Hiệu năng luôn là một vấn đề nan giải đối với những ứng dụng mobile cross platform. Hiện tại chúng ta chỉ nên phát triển những ứng dụng nhỏ quy mô không cao và chờ đợi. Trong tương lai rất có thể Chrome OS sẽ lên các thiết bị di động, mà đặc trưng của hệ điều hành này chính là việc toàn bộ giao diện là web. Vì vậy tới lúc đó chúng ta sẽ không phải suy nghĩ đến hiệu năng khi làm những sản phẩm mobile cross platform nữa.

    Hystore không những chỉ đơn thuần chỉ là dịch vụ mà còn là giải pháp, không chỉ là giải pháp cho hôm nay mà còn cho cả tương lai.

  2. **Yêu cầu nghiệp vụ**
    1. **BR1: Chứng thực**
      1. **BR1.1. Đăng ký** - Người dùng có thể đăng ký tài khoản sử dụng thông qua hệ thống.
      2. **BR1.2: Đăng nhập** - Người dùng sử dụng dịch vụ có thể đăng nhập hoặc không.

    2. **BR2: Quản lý tài khoản**
      1. **BR2.1: Hiển thị tài khoả**n - Hệ thống cho phép hiển thị và sắp xếp danh sách tài khoản theo tên và theo các thống số như: xếp hạng, số lượng ứng dụng, số lượt tải xuống,… Hiển thị chi tiết tài khoản như: Tên, địa chỉ, số điện thoại, email,…
      2. **BR2.2: Thao tác với tài khoản** - Hệ thống cho phép tạo mới, sửa thống tin và xóa tài khoản.
      3. **BR2.3: Phân quyền** - Hệ thống cũng cho phép phần quyền tài khoản theo 4 loại: quản trị, nhà phát triển, người dùng và các tài khoản bị khóa. Dựa vào đó mà mỗi tài khoản sẽ có thể sự dụng các chức năng tương ứng mà hệ thống cho phép.

    3. **BR3: Quản lý ứng dụng**
      1. **BR3.1: Chứng thực ứng dụng** - Với mỗi ứng dụng do nhà phát triển tải lên hệ thống. Hệ thống sẽ kiểm tra xem liệu cấu trúc của ứng dụng có hợp lệ hay không rồi mới cho phép lưu ứng dụng lên hệ thống.
      2. **BR3.2: Hiển thị ứng dụn**g - Hệ thống cho phép hiển thị và sắp xếp danh sách ứng dụng theo thể loại, xếp hạng, tên, số lượt tải xuống, số lượt nhận xét, ngày tải lên. Hiển thị lịch sử các phiên bản
      3. **BR3.3: Thao tác với ứng dụng** - Hệ thống cho phép thêm mới, sửa, xóa, tải lên, tải xuống ứng dụng.

    4. **BR4: Quản lý thể loại**
      1. **BR3.1: Hiển thị thể loại** - Hệ thống cho phép hiển thị và sắp xếp danh sách các thể loại dựa trên: tên, số lượng ứng dụng trên mỗi thể loại.
      2. **BR3.2: Thao tác với thể loại** - Hệ thống cho phép thêm mới, sửa, xóa các thể loại.

    5. **BR5: Quản lý nhận xét**
      1. **BR5.1: Hiển thị nhận xét** - Hệ thống cho phép hiển thị và sắp xếp nhận xét trên mỗi ứng dụng theo các tiêu chí: mức độ, ngày thêm.
      2. **BR5.2 Thao tác với nhận xét** - Hệ thống cho phép thêm mới, sửa, xóa các nhận xét trên mỗi ứng dụng.

    6. **BR6: Số liệu tổng quan** - Hệ thống cho phép xem thông tin tổng quan của qoàn bộ hệ thống bao gồm thông tin về số lượng các ứng dụng, tài khoản, nhận xét, thể loại, lượt tải lên, lượt tải xuống, lượt truy cập.

    7. **BR7: Báo cáo thống kê** - Hệ thống cho phép tạo các báo cáo theo ngày, tháng, quý, năm cho các thông số về số lượng các ứng dụng, tài khoản, nhận xét, thể loại, lượt tải lên, lượt tải xuống, lượt truy cập.
