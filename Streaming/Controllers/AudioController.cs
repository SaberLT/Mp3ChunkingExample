using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NAudio.Wave;

namespace Streaming.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : ControllerBase
    {
        [HttpGet("test")]
        public string Test([FromQuery] string data)
        {
            return "test";
            //return new Resp()
            //{
            //    Result = "test"
            //};
        }

        //[HttpGet("loadFile")]
        //public byte[] LoadFile([FromQuery] string file)
        //{
        //    var bytes = System.IO.File.ReadAllBytes($"Audio\\{file}");
        //    return bytes;
        //}


        [HttpGet("loadFile")]
        public FileResult LoadFile([FromQuery] string file)
        {
            var filepath = $"Audio\\{file}";
            var bytes = System.IO.File.ReadAllBytes(filepath);

            //Mp3FileReader reader = new Mp3FileReader(filepath);
            //Mp3Frame frame;
            //var length = 4608 * 128;
            //var buffer = new byte[length];
            //for(var i =0;i<128; ++i)
            //{
            //    frame = reader.ReadNextFrame();
            //    var result = frame.RawData;
            //    Array.Copy(result, 0, buffer, i * frame.RawData.Length, frame.RawData.Length);
            //}
            //await reader.ReadAsync(buffer, 0, length);

            var buffer = TrimMp3(filepath, "", TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(55));

            //var file = new File(buffer., "audio/mpeg");

            return File(buffer.ToArray(), "audio/mpeg");
        }
        private MemoryStream TrimMp3(string inputPath, string outputPath, TimeSpan? begin, TimeSpan? end)
        {
            if (begin.HasValue && end.HasValue && begin > end)
                throw new ArgumentOutOfRangeException("end", "end should be greater than begin");

            using (var reader = new Mp3FileReader(inputPath))
            using (var writer = new MemoryStream())
            {
                Mp3Frame frame;
                while ((frame = reader.ReadNextFrame()) != null)
                    if (reader.CurrentTime >= begin || !begin.HasValue)
                    {
                        if (reader.CurrentTime <= end || !end.HasValue)
                            writer.Write(frame.RawData, 0, frame.RawData.Length);
                        else break;
                    }

                return writer;
            }

        }

    }

}